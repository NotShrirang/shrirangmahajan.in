import Code from "../../../utils/codeUtils.jsx";
import Expander from "../../../utils/Expander.jsx";
import BaseBlog from "../BaseBlog.js";
import cover from "../../../assets/images/blogs/TinyGPT/cover.png";

const title = "Pre-training a 95M Parameter LLM on a Consumer GPU";

const content = (
  <div style={{ width: "100%" }}>
    <p>
      Can you train a language model from scratch on a single RTX 3070 Ti with
      only 8GB VRAM? Spoiler: yes, you can. In this post, I'll walk through how
      I pre-trained{" "}
      <a
        href="https://github.com/NotShrirang/tinygpt"
        target="_blank"
        rel="noreferrer"
      >
        TinyGPT2
      </a>
      , a 95 million parameter transformer model, on consumer hardware—and the
      engineering tricks that made it possible.
    </p>
    <p>
      This isn't about building the next Claude or GPT. It's about understanding
      what happens under the hood when you train a language model, and proving
      that you don't need a cluster of A100s to learn these fundamentals
      hands-on.
    </p>

    <h2>The Challenge: 8GB Isn't Much</h2>
    <p>
      Let's do some back-of-napkin math. A 95M parameter model in float32 needs
      about 380MB just for the weights. But during training, you also need:
    </p>
    <ul>
      <li>
        <b>Gradients</b>: Another 380MB
      </li>
      <li>
        <b>Optimizer states</b>: AdamW stores two momentum terms per parameter,
        so ~760MB more
      </li>
      <li>
        <b>Activations</b>: These scale with batch size and sequence
        length—easily several GB
      </li>
    </ul>
    <p>
      Add it up and you're looking at 5-6GB minimum before you've even loaded a
      single batch of data. With an 8GB card, there's not much room for error.
    </p>

    <h2>The Architecture: TinyGPT2</h2>
    <p>
      TinyGPT2 is a decoder-only transformer with some modern architectural
      improvements over the original GPT-2:
    </p>
    <Code
      language="python"
      content={`@dataclass
class TinyGPT2Config:
    vocab_size: int = 50304      # GPT-2 vocab + padding token
    block_size: int = 512        # Context window
    n_embd: int = 768            # Embedding dimension
    n_head: int = 12             # Attention heads
    n_layer: int = 12            # Transformer blocks
    gqa_kv_head: int = 4         # KV heads for GQA
    hidden_size: int = 2048      # FFN hidden dimension
    dropout: float = 0.1`}
      expander={false}
      copy={true}
    />
    <p>Key architectural choices:</p>
    <ul>
      <li>
        <b>Grouped Query Attention (GQA)</b>: Instead of having 12 key-value
        heads matching our 12 query heads, we use only 4 KV heads. This reduces
        memory usage during attention computation and enables efficient KV
        caching during inference.
      </li>
      <li>
        <b>Rotary Position Embeddings (RoPE)</b>: No learned position
        embeddings. RoPE encodes position information directly into the
        attention computation, which generalizes better to different sequence
        lengths.
      </li>
      <li>
        <b>RMSNorm</b>: Replaces LayerNorm. It's computationally cheaper (no
        mean subtraction) and often more stable during training.
      </li>
      <li>
        <b>Weight Tying</b>: The input embedding matrix and output projection
        share weights, cutting ~38M parameters.
      </li>
    </ul>

    <h3>Grouped Query Attention: A Closer Look</h3>
    <p>
      Standard multi-head attention has separate K, V projections for each head.
      With 12 heads and 768 embedding dimensions, that's significant memory. GQA
      groups multiple query heads to share the same K, V heads:
    </p>
    <Code
      language="python"
      content={`class GroupedQueryAttention(nn.Module):
    def __init__(self, config):
        super().__init__()
        self.n_head = config.n_head        # 12 query heads
        self.n_kv_head = config.gqa_kv_head  # 4 KV heads
        self.head_dim = config.n_embd // config.n_head
        
        # Q has full heads, K and V have fewer
        self.q_proj = nn.Linear(config.n_embd, config.n_embd)
        self.k_proj = nn.Linear(config.n_embd, self.n_kv_head * self.head_dim)
        self.v_proj = nn.Linear(config.n_embd, self.n_kv_head * self.head_dim)
        self.o_proj = nn.Linear(config.n_embd, config.n_embd)
    
    def forward(self, x, freqs_cis, mask=None):
        B, T, C = x.shape
        
        q = self.q_proj(x).view(B, T, self.n_head, self.head_dim)
        k = self.k_proj(x).view(B, T, self.n_kv_head, self.head_dim)
        v = self.v_proj(x).view(B, T, self.n_kv_head, self.head_dim)
        
        # Apply RoPE to queries and keys
        q, k = apply_rotary_emb(q, k, freqs_cis)
        
        # Repeat KV heads to match query heads (12 / 4 = 3 repeats)
        k = k.repeat_interleave(self.n_head // self.n_kv_head, dim=2)
        v = v.repeat_interleave(self.n_head // self.n_kv_head, dim=2)
        
        # Standard attention from here
        ...`}
      expander={false}
      copy={true}
    />
    <p>
      This gives us 3× memory savings on K and V projections and caches, with
      minimal quality loss.
    </p>

    <h2>Training Strategy: Making 8GB Work</h2>
    <p>The key insight: we can trade compute for memory. Here's how:</p>

    <h3>1. Mixed Precision Training (AMP)</h3>
    <p>
      Instead of float32 everywhere, we use bfloat16 for forward and backward
      passes. This halves memory for activations and speeds up computation on
      tensor cores:
    </p>
    <Code
      language="python"
      content={`# Training loop with automatic mixed precision
dtype = torch.bfloat16 if torch.cuda.is_bf16_supported() else torch.float16

for batch in dataloader:
    inputs = batch['input'].to(device)
    targets = batch['target'].to(device)
    
    # Forward pass in reduced precision
    with torch.autocast(device_type='cuda', dtype=dtype):
        logits, loss = model(inputs, targets)
    
    # Scale loss for gradient accumulation
    loss = loss / gradient_accumulation_steps
    loss.backward()
    
    if step % gradient_accumulation_steps == 0:
        torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
        optimizer.step()
        optimizer.zero_grad(set_to_none=True)`}
      expander={false}
      copy={true}
    />
    <p>
      Why bfloat16 over float16? bfloat16 has the same exponent range as
      float32, just less precision. This means no gradient scaling needed—one
      less thing to worry about.
    </p>

    <h3>2. Gradient Accumulation</h3>
    <p>
      We can't fit a large batch in memory, but we can simulate one. Instead of
      batch_size=512, we use batch_size=8 and accumulate gradients over 64
      steps:
    </p>
    <Code
      language="python"
      content={`# Config
batch_size = 8
gradient_accumulation_steps = 64
block_size = 512

# Effective batch size: 8 × 64 × 512 = 262,144 tokens per optimizer step
effective_batch_tokens = batch_size * gradient_accumulation_steps * block_size`}
      expander={false}
      copy={true}
    />
    <p>
      This means we process 262K tokens before each weight update. Large batch
      training is crucial for stable language model training—the gradient
      estimates are much less noisy.
    </p>

    <h3>3. torch.compile</h3>
    <p>
      PyTorch 2.0's compiler fuses operations and generates optimized CUDA
      kernels:
    </p>
    <Code
      language="python"
      content={`model = TinyGPT2(config).to(device)
model = torch.compile(model)  # That's it. Free speedup.`}
      expander={false}
      copy={true}
    />
    <p>
      In practice, this gave me a 20-30% speedup with no code changes. The
      compiler identifies patterns like "LayerNorm followed by Linear" and fuses
      them into single CUDA kernels.
    </p>

    <h3>4. Streaming Data</h3>
    <p>
      OpenWebText is 40GB+ on disk. Loading it all into RAM isn't practical.
      HuggingFace datasets with streaming mode to the rescue:
    </p>
    <Code
      language="python"
      content={`import datasets

# Stream data, never load full dataset into memory
ds = datasets.load_dataset(
    "Skylion007/openwebtext", 
    split="train", 
    streaming=True,
    trust_remote_code=False
)

def collate_fn(batch):
    """Tokenize and prepare batch on-the-fly"""
    texts = [item['text'] for item in batch]
    all_tokens = []
    for text in texts:
        tokens = tokenizer.encode(text)
        all_tokens.extend(tokens + [tokenizer.eos_id])
    
    # Create input-target pairs with sliding window
    inputs, targets = [], []
    for i in range(0, len(all_tokens) - block_size, block_size):
        inputs.append(all_tokens[i:i + block_size])
        targets.append(all_tokens[i + 1:i + block_size + 1])
    
    return {
        'input': torch.tensor(inputs, dtype=torch.long),
        'target': torch.tensor(targets, dtype=torch.long)
    }`}
      expander={false}
      copy={true}
    />

    <h2>The Training Run</h2>
    <p>With everything set up, here's what the actual training looked like:</p>
    <ul>
      <li>
        <b>Dataset</b>: OpenWebText (~6.7B tokens)
      </li>
      <li>
        <b>Hardware</b>: Single NVIDIA RTX 3070 Ti (8GB VRAM)
      </li>
      <li>
        <b>Training time</b>: ~5 days for 25,000 optimizer steps
      </li>
      <li>
        <b>Tokens processed</b>: 6.5B+ tokens (multiple epochs)
      </li>
      <li>
        <b>Throughput</b>: ~15,000-18,000 tokens/second
      </li>
    </ul>

    <h3>Optimizer Configuration</h3>
    <Code
      language="python"
      content={`optimizer = torch.optim.AdamW(
    model.parameters(),
    lr=3e-4,
    weight_decay=0.1,
    betas=(0.9, 0.95),
    fused=True  # Use CUDA-fused implementation
)

# OneCycleLR: ramp up, then decay
scheduler = lr_scheduler.OneCycleLR(
    optimizer,
    max_lr=8e-4,
    total_steps=50000,
    pct_start=0.05  # 5% warmup
)`}
      expander={false}
      copy={true}
    />
    <p>
      The learning rate schedule is important. We warm up for the first 5% of
      training (prevents early instability), hit peak learning rate, then
      gradually decay. This is standard practice for transformer training.
    </p>

    <h3>Loss Curves</h3>
    <p>Here's roughly what training looked like:</p>
    <ul>
      <li>
        Step 0: Loss ~10.0 (random initialization, predicting ~50K classes)
      </li>
      <li>Step 1,000: Loss ~4.5 (learning common tokens)</li>
      <li>Step 5,000: Loss ~3.2 (grammatical structure emerging)</li>
      <li>Step 15,000: Loss ~2.8 (coherent sentences)</li>
      <li>Step 25,000: Loss ~2.5 (good fluency, reasonable coherence)</li>
    </ul>
    <p>
      Validation loss tracked training loss closely, indicating we weren't
      overfitting. The model saw each token only 1-2 times on average over the
      full training run.
    </p>

    <h2>Supervised Fine-Tuning (SFT)</h2>
    <p>
      A pre-trained model is good at predicting next tokens, but not at
      following instructions. Enter SFT: we fine-tune on instruction-response
      pairs.
    </p>
    <Code
      language="python"
      content={`# Alpaca-style prompt template
def format_prompt(instruction, input_text=""):
    if input_text:
        return f"""### Instruction:
{instruction}

### Input:
{input_text}

### Response:
"""
    return f"""### Instruction:
{instruction}

### Response:
"""

# Only compute loss on the response, not the prompt
labels = [-100] * len(prompt_tokens) + response_tokens`}
      expander={false}
      copy={true}
    />
    <p>Key SFT details:</p>
    <ul>
      <li>
        <b>Dataset</b>: Stanford Alpaca (52K instruction-response pairs)
      </li>
      <li>
        <b>Learning rate</b>: 2e-5 (10× lower than pre-training to avoid
        forgetting)
      </li>
      <li>
        <b>Epochs</b>: 3 (~85 minutes total)
      </li>
      <li>
        <b>Loss masking</b>: Only train on response tokens, ignore prompt
      </li>
    </ul>

    <h2>Results: What Can 95M Parameters Do?</h2>
    <p>
      Let's be real: this isn't GPT-4. But it's surprisingly capable for its
      size:
    </p>
    <Code
      language="text"
      content={`Prompt: What is the capital of France?
Response: The capital of France is Paris. It is the largest city in France 
and serves as the country's political, economic, and cultural center.

Prompt: Write a short poem about the moon.
Response: The moon shines bright in the night,
A silver orb of gentle light.
It watches over land and sea,
A faithful friend for you and me.

Prompt: Explain what machine learning is in simple terms.
Response: Machine learning is a type of artificial intelligence that allows 
computers to learn from data without being explicitly programmed. Instead of 
following strict rules, the computer finds patterns in examples and uses those 
patterns to make predictions or decisions.`}
      expander={false}
      copy={true}
    />
    <p>
      It handles factual questions, creative writing, and explanations
      reasonably well. It struggles with complex reasoning, long-form
      consistency, and nuanced tasks—but that's expected at this scale.
    </p>

    <h2>Lessons Learned</h2>
    <p>After spending a week watching loss curves, here's what I took away:</p>
    <ol>
      <li>
        <b>Memory is the bottleneck</b>. Most of my optimization effort went
        into fitting more into 8GB. The actual training code is straightforward
        once you have memory under control.
      </li>
      <li>
        <b>Large effective batch sizes matter</b>. Early experiments with
        smaller batches (32K tokens) showed much noisier training. 262K tokens
        per update made training smooth and stable.
      </li>
      <li>
        <b>torch.compile is magic</b>. Zero code changes, significant speedup.
        No reason not to use it.
      </li>
      <li>
        <b>Streaming data works</b>. I was skeptical about not having data in
        RAM, but disk I/O was never the bottleneck. The GPU is always the
        limiting factor.
      </li>
      <li>
        <b>Checkpointing is essential</b>. Training crashed twice (power
        outages). Saving checkpoints every 500 steps saved days of compute.
      </li>
    </ol>

    <h2>Try It Yourself</h2>
    <p>Everything is open source:</p>
    <ul>
      <li>
        <a
          href="https://github.com/NotShrirang/tinygpt"
          target="_blank"
          rel="noreferrer"
        >
          GitHub Repository
        </a>{" "}
        - Full training code, model architecture, and scripts
      </li>
      <li>
        <a
          href="https://huggingface.co/NotShrirang/tinygpt"
          target="_blank"
          rel="noreferrer"
        >
          HuggingFace
        </a>{" "}
        - Pre-trained weights you can download and use
      </li>
      <li>
        <a
          href="https://tinygpt.streamlit.app/"
          target="_blank"
          rel="noreferrer"
        >
          Live Demo
        </a>{" "}
        - Try the model in your browser
      </li>
    </ul>
    <p>To train your own:</p>
    <Code
      language="bash"
      content={`# Clone the repo
git clone https://github.com/NotShrirang/tinygpt.git
cd tinygpt

# Install dependencies
pip install -r requirements.txt

# Start pre-training (will take several days on consumer hardware)
python train_liger.py

# Or resume from checkpoint
python train_liger.py --resume

# Fine-tune on Alpaca after pre-training
python sft.py --checkpoint checkpoints/ckpt_step25000.pth`}
      expander={false}
      copy={true}
    />

    <h2>What's Next?</h2>
    <p>There's always more to explore:</p>
    <ul>
      <li>
        <b>Flash Attention</b>: Even more memory-efficient attention that would
        allow larger context windows
      </li>
      <li>
        <b>LoRA fine-tuning</b>: Train adapters instead of full weights for
        domain adaptation
      </li>
      <li>
        <b>Quantization</b>: INT8 or INT4 inference for deployment on even
        smaller devices
      </li>
      <li>
        <b>RLHF</b>: Human feedback training to improve response quality
      </li>
    </ul>
    <p>
      The democratization of AI training is real. You don't need a datacenter to
      understand how language models work—or to train your own. A gaming GPU,
      some patience, and curiosity are enough to get started.
    </p>

    <h2>Resources</h2>
    <ul>
      <li>
        <a
          href="https://github.com/karpathy/nanoGPT"
          target="_blank"
          rel="noreferrer"
        >
          Andrej Karpathy's nanoGPT - The inspiration for this project
        </a>
      </li>
      <li>
        <a
          href="https://arxiv.org/abs/2305.13245"
          target="_blank"
          rel="noreferrer"
        >
          GQA Paper - Grouped Query Attention explained
        </a>
      </li>
      <li>
        <a
          href="https://arxiv.org/abs/2104.09864"
          target="_blank"
          rel="noreferrer"
        >
          RoFormer Paper - Rotary Position Embeddings
        </a>
      </li>
      <li>
        <a
          href="https://pytorch.org/docs/stable/amp.html"
          target="_blank"
          rel="noreferrer"
        >
          PyTorch AMP Documentation
        </a>
      </li>
    </ul>
    <p>
      If you found this useful, give the repo a star. And if you train your own
      model, I'd love to hear about it!
    </p>
  </div>
);

const slug = "pretraining-95m-llm-consumer-gpu";
const image = cover;
const tags = [
  "LLM",
  "PyTorch",
  "Pre-training",
  "Mixed Precision",
  "Transformer",
  "Deep Learning",
  "GPU",
  "Machine Learning",
];

const date = "2026-03-08";
const readTime = 15;

const TinyGPTBlog = new BaseBlog(
  title,
  content,
  slug,
  image,
  tags,
  date,
  readTime,
);

export default TinyGPTBlog;
