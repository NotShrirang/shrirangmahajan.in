import Code from "../../../utils/codeUtils.jsx";
import TenorEmbed from "../../../utils/TenorEmbed.jsx";
import Expander from "../../../utils/Expander.jsx";
import BaseBlog from "../BaseBlog.js";
import cover from "../../../assets/images/blogs/Llama2Explained/cover.png";
import GroupedQueryAttention from "../../../assets/images/blogs/Llama2Explained/grouped_query_attention.png";
import NeuralNetworkDiagram from "./architectureUtils.jsx";

const title = "Llama 2 Explained";

const content = (
  <div style={{ width: "100%" }}>
    <p>
      Meta's Llama 2 model represents a significant advancement in open-source
      large language models. In this deep dive, we'll explore the architecture,
      key innovations like Grouped Query Attention, KV Cache, and the training
      methodology that makes Llama 2 so powerful.
    </p>

    <h2>Llama 2 Architecture Overview</h2>
    <p>
      Llama 2 follows the decoder-only transformer architecture, similar to GPT
      models. It comes in three sizes: 7B, 13B, and 70B parameters. The
      architecture consists of the following components:
    </p>
    <ul>
      <li>
        <b>Token Embeddings</b>: Convert input tokens to vectors in a
        high-dimensional space
      </li>
      <li>
        <b>Transformer Blocks</b>: The core computational units (multiple
        layers)
      </li>
      <li>
        <b>RMSNorm</b>: Used for pre-normalization in each transformer block for
        improved training stability
      </li>
      <li>
        <b>SwiGLU Activation</b>: An improved activation function in the
        feed-forward networks
      </li>
      <li>
        <b>Rotary Positional Embeddings (RoPE)</b>: Encodes position information
        directly in the attention computation
      </li>
      <li>
        <b>Grouped-Query Attention (GQA)</b>: A key innovation for efficiency
      </li>
    </ul>
    <p>
      The model processes text by first tokenizing it (breaking it into smaller
      units), embedding these tokens, passing them through multiple transformer
      blocks, and finally projecting to vocabulary probabilities.
    </p>
    <div>
      <NeuralNetworkDiagram />
    </div>
    <h2>Root Mean Squared Normalization (RMSNorm)</h2>
    <p>
      Previously, LayerNorm was being used extensively for normalizing. It
      normalizes the layers rows-wise, which means it normalizes each feature
      independently. This allows model to amplify the scale of each feature or
      apply a translation to the feature according to the needs of the loss
      function.
    </p>
    <p>LayerNorm can be mathematically represented as:</p>
    <Code
      language="python"
      content={`class SimpleLayerNorm(nn.Module):
    def __init__(self, normalized_shape: int, eps: float = 1e-5):
        """
        A simple implementation of Layer Normalization.

        Args:
            normalized_shape (int): the number of features in the last dimension to normalize over.
            eps (float): small value to avoid division by zero.
        """
        super().__init__()
        self.eps = eps
        self.weight = nn.Parameter(torch.ones(normalized_shape))  # γ
        self.bias = nn.Parameter(torch.zeros(normalized_shape))   # β

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        """
        Applies layer normalization to the input.

        Args:
            x (torch.Tensor): input tensor of shape (..., normalized_shape)

        Returns:
            torch.Tensor: normalized tensor of same shape as input
        """
        mean = x.mean(dim=-1, keepdim=True)
        var = x.var(dim=-1, unbiased=False, keepdim=True)
        x_norm = (x - mean) / torch.sqrt(var + self.eps)
        return self.weight * x_norm + self.bias`}
      expander={false}
      copy={true}
    />
    <p>But LayerNorm has its drawbacks:</p>
    <ul>
      <li>It can be computationally expensive for large models.</li>
      <li>
        It may not always lead to the best convergence properties during
        training.
      </li>
      <li>
        It can introduce noise in the gradients, especially in large models.
      </li>
    </ul>
    <p>
      The authors of{" "}
      <a href="https://arxiv.org/pdf/1910.07467">RMSNorm Paper</a> believe that
      the recentering of the input is not needed.{" "}
    </p>
    <p>
      Unlike LayerNorm, which normalizes each feature independently, RMSNorm
      normalizes the activations across the batch dimension. This can lead to
      faster convergence and improved model performance.
    </p>
    <div
      style={{
        borderLeft: "4px solid gray",
        paddingLeft: "10px",
        fontSize: "1.2rem",
      }}
    >
      <i>
        RMSNorm forces the summed inputs into a √n-scaled unit sphere. By doing
        so, the output distribution remains regardless of the scaling of input
        and weight distributions, benefiting the stability of layer activations.
      </i>
    </div>
    <p>RMSNorm can be implemented as:</p>
    <Code
      language="python"
      content={`class RMSNorm(nn.Module):
    def __init__(self, dim: int, eps: float = 1e-6):
        super().__init__()
        self.eps = eps
        self.weight = nn.Parameter(torch.ones(dim))

    def _norm(self, x: torch.Tensor) -> torch.Tensor:
        return x / torch.sqrt(x.pow(2).mean(-1, keepdim=True) + self.eps)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.weight * self._norm(x)`}
      expander={false}
      copy={true}
    />
    <h2>Rotary Positional Embeddings (RoPE)</h2>
    <p>
      In transformer models, positional embeddings are crucial for capturing
      sequential information. Llama 2 uses Rotary Positional Embeddings (RoPE),
      which encode position information directly into the attention computation.
    </p>
    <p>
      RoPE uses complex numbers to represent positions, allowing the model to
      learn relationships between tokens in a more flexible way. This is done by
      rotating the query and key vectors in the complex plane based on their
      positions.
    </p>
    <p>
      Traditional positional embeddings add a fixed vector to the input tokens
      to encode their positions. This works well for short sequences but can be
      limiting for longer sequences. RoPE, on the other hand, encodes position
      information directly into the attention computation, allowing the model to
      handle longer sequences more effectively.
    </p>
    <h2>Grouped-Query Attention (GQA): The Efficiency Innovation</h2>
    <p>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          width={"60%"}
          src={GroupedQueryAttention}
          alt="Grouped Query Attention visualization"
        />
        <p style={{ fontSize: "0.8rem" }}>
          <i>
            Comparison of MHA, MQA, and GQA attention mechanisms (Source:
            HuggingFace)
          </i>
        </p>
      </div>
    </p>
    <p>
      One of the most significant innovations in Llama 2 is Grouped-Query
      Attention (GQA). Traditional multi-head attention (MHA) has separate key
      (K), query (Q), and value (V) heads for each attention head. This creates
      a memory bottleneck during inference, especially for long sequences.
    </p>
    <p>Here's a simplified implementation of GQA in PyTorch:</p>
    <Code
      language="python"
      content={`class GroupedQueryAttention(nn.Module):
    def __init__(self, args: Llama2Config) -> None:
        super().__init__()

        self.n_kv_heads = args.n_kv_heads if args.n_kv_heads is not None else args.n_heads
        self.n_heads_q = args.n_heads
        self.n_rep = self.n_heads_q // self.n_kv_heads

        self.head_dim = args.dim // args.n_heads

        self.wq = nn.Linear(args.dim, args.n_heads * self.head_dim, bias=False)
        self.wk = nn.Linear(args.dim, self.n_kv_heads *
                            self.head_dim, bias=False)
        self.wv = nn.Linear(args.dim, self.n_kv_heads *
                            self.head_dim, bias=False)
        self.wo = nn.Linear(args.n_heads * self.head_dim, args.dim, bias=False)

        self.register_buffer("cache_k", torch.zeros((args.max_batch_size, args.max_seq_len, self.n_kv_heads, self.head_dim)), persistent=False)
        self.register_buffer("cache_v", torch.zeros((args.max_batch_size, args.max_seq_len, self.n_kv_heads, self.head_dim)), persistent=False)

    def forward(self, x: torch.Tensor, start_pos: int, freqs_complex: torch.Tensor) -> torch.Tensor:
        batch_size, seq_len, _ = x.shape

        xq = self.wq(x)
        xk = self.wk(x)
        xv = self.wv(x)

        xq = xq.view(batch_size, seq_len, self.n_heads_q, self.head_dim)
        xk = xk.view(batch_size, seq_len, self.n_kv_heads, self.head_dim)
        xv = xv.view(batch_size, seq_len, self.n_kv_heads, self.head_dim)

        xq = apply_rotary_embedding(xq, freqs_complex, x.device)
        xk = apply_rotary_embedding(xk, freqs_complex, x.device)
        xv = apply_rotary_embedding(xv, freqs_complex, x.device)

        self.cache_k[:batch_size, start_pos:start_pos + seq_len] = xk
        self.cache_v[:batch_size, start_pos:start_pos + seq_len] = xv

        keys = self.cache_k[:batch_size, :start_pos + seq_len]
        values = self.cache_v[:batch_size, :start_pos + seq_len]

        keys = repeat_kv(keys, self.n_rep)
        values = repeat_kv(values, self.n_rep)

        xq = xq.transpose(1, 2)
        keys = keys.transpose(1, 2)
        values = values.transpose(1, 2)

        scores = torch.matmul(
            xq, keys.transpose(-2, -1)) / math.sqrt(self.head_dim)
        attn_len = keys.size(2)
        mask = torch.triu(
            torch.full((seq_len, attn_len), float('-inf'), device=x.device),
            diagonal=1
        )
        scores = scores + mask
        scores = F.softmax(scores.float(), dim=-1).type_as(xq)

        output = torch.matmul(scores, values)
        output = (output.transpose(1, 2).contiguous().view(
            batch_size, seq_len, -1))

        return self.wo(output)`}
      expander={false}
      copy={true}
    />
    <Expander>
      <p>
        GQA sits between Multi-Head Attention (MHA) and Multi-Query Attention
        (MQA):
      </p>
      <ul>
        <li>
          <b>Multi-Head Attention (MHA)</b>: Each attention head has its own K,
          Q, and V projections (high quality but memory-intensive)
        </li>
        <li>
          <b>Multi-Query Attention (MQA)</b>: All attention heads share a single
          K and V projection (memory-efficient but lower quality)
        </li>
        <li>
          <b>Grouped-Query Attention (GQA)</b>: A middle ground where multiple
          attention heads share the same K and V projections, but each group has
          its own K and V
        </li>
      </ul>
      <p>
        In GQA, if you have N attention heads and G groups, each group will have
        N/G attention heads sharing the same K and V projections. This
        significantly reduces the memory footprint during inference while
        maintaining most of the model quality.
      </p>
    </Expander>
    <h2>KV Cache: Accelerating Generation</h2>
    <p>
      When generating text, language models process one token at a time. For
      each new token, they would need to recompute the key (K) and value (V)
      vectors for all previous tokens. The KV cache optimization stores these
      vectors after they've been computed once, making generation much faster.
    </p>

    <Expander>
      <p>Here's how KV cache works in autoregressive generation:</p>
      <ol>
        <li>
          When processing the first token, compute Q, K, and V projections
          normally.
        </li>
        <li>Store the K and V vectors in a cache.</li>
        <li>
          For each subsequent token, only compute Q, K, and V for the new token.
        </li>
        <li>
          Concatenate the new K and V with the cached K and V from previous
          tokens.
        </li>
        <li>Compute attention using the new Q and the concatenated K and V.</li>
        <li>Update the cache with the new K and V.</li>
      </ol>
      <p>
        This optimization significantly reduces the computation needed for text
        generation, making inference faster, especially for long sequences.
      </p>
    </Expander>
    <p>Here's a simplified implementation of KV caching:</p>
    <Code
      language="python"
      content={`def generate_with_kv_cache(model, input_ids, max_length):
    batch_size = input_ids.shape[0]
    
    # Initialize KV cache (for each layer in the model)
    num_layers = len(model.layers)
    past_key_values = [None] * num_layers
    
    # Generate tokens one by one
    for i in range(max_length):
        # If first iteration, process the whole input
        # Otherwise, only process the last generated token
        if i == 0:
            current_input = input_ids
        else:
            current_input = next_token.unsqueeze(1)
        
        # Forward pass with KV cache
        outputs = model(
            current_input,
            past_key_values=past_key_values,
            use_cache=True
        )
        
        logits = outputs.logits
        next_token_logits = logits[:, -1, :]
        
        # Sample next token
        next_token = torch.argmax(next_token_logits, dim=-1)
        
        # Update input_ids with generated token
        input_ids = torch.cat([input_ids, next_token.unsqueeze(-1)], dim=-1)
        
        # Update KV cache for next iteration
        past_key_values = outputs.past_key_values
    
    return input_ids`}
      expander={false}
      copy={true}
    />
    <h2>The SwiGLU Activation Function</h2>
    <p>
      Llama 2 uses the SwiGLU activation function in its feed-forward networks.
      SwiGLU is a combination of the Swish activation function and the Gated
      Linear Unit (GLU).
    </p>
    <p>SwiGLU can be mathematically represented as:</p>
    <Code
      language="python"
      content={`def swiglu(x, w1, w2):
    return x * torch.sigmoid(torch.matmul(x, w1) + torch.matmul(x, w2))`}
      expander={false}
      copy={true}
    />
    <h2>Training Details: How Llama 2 Was Built</h2>
    <p>
      Llama 2 was trained using a massive dataset and sophisticated training
      methodology:
    </p>

    <h3>Pretraining</h3>
    <ul>
      <li>
        <b>Dataset</b>: 2 trillion tokens from publicly available sources
      </li>
      <li>
        <b>Tokenizer</b>: BPE tokenizer with a vocabulary of 32K tokens
      </li>
      <li>
        <b>Optimization</b>: AdamW optimizer with cosine learning rate schedule
      </li>
      <li>
        <b>Context Length</b>: Trained on sequences of up to 4,096 tokens
      </li>
      <li>
        <b>Compute</b>: Trained on thousands of GPUs for millions of GPU-hours
      </li>
    </ul>

    <h3>Fine-tuning for Chat</h3>
    <p>Llama 2-Chat models underwent an extensive fine-tuning process:</p>
    <ol>
      <li>
        <b>Supervised Fine-Tuning (SFT)</b>: Initial fine-tuning on
        human-generated demonstration data to follow human instructions
      </li>
      <li>
        <b>Reinforcement Learning from Human Feedback (RLHF)</b>:
        <ul>
          <li>Created a reward model from human preference data</li>
          <li>
            Used Proximal Policy Optimization (PPO) to optimize the model based
            on the reward function
          </li>
        </ul>
      </li>
      <li>
        <b>Red Teaming and Safety</b>: Extensive testing and iteration to reduce
        harmful outputs and improve helpfulness
      </li>
    </ol>

    <h2>Architectural Details</h2>
    <p>Let's look at the specific architecture details for each model size:</p>

    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        marginBottom: "20px",
      }}
    >
      <thead>
        <tr style={{ backgroundColor: "gray" }}>
          <th
            style={{
              border: "1px solid #ddd",
              padding: "8px",
              textAlign: "left",
            }}
          >
            Parameter
          </th>
          <th
            style={{
              border: "1px solid #ddd",
              padding: "8px",
              textAlign: "left",
            }}
          >
            Llama 2 7B
          </th>
          <th
            style={{
              border: "1px solid #ddd",
              padding: "8px",
              textAlign: "left",
            }}
          >
            Llama 2 13B
          </th>
          <th
            style={{
              border: "1px solid #ddd",
              padding: "8px",
              textAlign: "left",
            }}
          >
            Llama 2 70B
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={{ border: "1px solid #ddd", padding: "8px" }}>
            Hidden Size
          </td>
          <td style={{ border: "1px solid #ddd", padding: "8px" }}>4,096</td>
          <td style={{ border: "1px solid #ddd", padding: "8px" }}>4,096</td>
          <td style={{ border: "1px solid #ddd", padding: "8px" }}>4,096</td>
        </tr>
        <tr>
          <td style={{ border: "1px solid #ddd", padding: "8px" }}>
            Intermediate Size
          </td>
          <td style={{ border: "1px solid #ddd", padding: "8px" }}>11,008</td>
          <td style={{ border: "1px solid #ddd", padding: "8px" }}>11,008</td>
          <td style={{ border: "1px solid #ddd", padding: "8px" }}>11,008</td>
        </tr>
        <tr>
          <td style={{ border: "1px solid #ddd", padding: "8px" }}>
            Num Attention Heads
          </td>
          <td style={{ border: "1px solid #ddd", padding: "8px" }}>32</td>
          <td style={{ border: "1px solid #ddd", padding: "8px" }}>40</td>
          <td style={{ border: "1px solid #ddd", padding: "8px" }}>64</td>
        </tr>
        <tr>
          <td style={{ border: "1px solid #ddd", padding: "8px" }}>
            Num KV Heads (GQA)
          </td>
          <td style={{ border: "1px solid #ddd", padding: "8px" }}>32</td>
          <td style={{ border: "1px solid #ddd", padding: "8px" }}>40</td>
          <td style={{ border: "1px solid #ddd", padding: "8px" }}>8</td>
        </tr>
        <tr>
          <td style={{ border: "1px solid #ddd", padding: "8px" }}>
            Num Layers
          </td>
          <td style={{ border: "1px solid #ddd", padding: "8px" }}>32</td>
          <td style={{ border: "1px solid #ddd", padding: "8px" }}>40</td>
          <td style={{ border: "1px solid #ddd", padding: "8px" }}>80</td>
        </tr>
        <tr>
          <td style={{ border: "1px solid #ddd", padding: "8px" }}>
            RMS Norm Eps
          </td>
          <td style={{ border: "1px solid #ddd", padding: "8px" }}>1e-6</td>
          <td style={{ border: "1px solid #ddd", padding: "8px" }}>1e-6</td>
          <td style={{ border: "1px solid #ddd", padding: "8px" }}>1e-6</td>
        </tr>
      </tbody>
    </table>

    <p>
      Notice how the 70B model uses only 8 KV heads despite having 64 attention
      heads, demonstrating the efficiency gains from Grouped-Query Attention.
    </p>

    <h2>Performance Improvements from Llama 1 to Llama 2</h2>
    <p>Llama 2 introduced several improvements over its predecessor:</p>
    <ul>
      <li>
        <b>2× More Training Data</b>: More tokens during pretraining
      </li>
      <li>
        <b>Longer Context Length</b>: 4K tokens vs 2K in Llama 1
      </li>
      <li>
        <b>Grouped-Query Attention</b>: For improved inference efficiency
      </li>
      <li>
        <b>Enhanced RLHF</b>: More sophisticated alignment techniques
      </li>
      <li>
        <b>Improved Safety</b>: More robust against generating harmful content
      </li>
    </ul>

    <p>
      These improvements collectively led to significant performance gains
      across various benchmarks, with Llama 2 outperforming similarly sized
      open-source models and approaching the capabilities of proprietary models
      in many cases.
    </p>

    <h2>Limitations and Challenges</h2>
    <p>
      Despite its impressive capabilities, Llama 2 still faces several
      challenges:
    </p>
    <ul>
      <li>
        <b>Hallucinations</b>: Like all large language models, Llama 2 can
        generate incorrect information confidently
      </li>
      <li>
        <b>Limited Context Window</b>: While improved to 4K tokens, still
        limited compared to some newer models with 8K-32K context lengths
      </li>
      <li>
        <b>Training Data Cutoff</b>: Knowledge limited to data available during
        training
      </li>
      <li>
        <b>Bias and Fairness</b>: May reflect biases present in the training
        data
      </li>
    </ul>

    <h2>Conclusion</h2>
    <p>
      Llama 2 represents a significant advancement in open-source large language
      models. Its innovative architecture, particularly the Grouped-Query
      Attention mechanism, strikes an excellent balance between computational
      efficiency and model quality. The KV cache optimization further enhances
      its performance during text generation.
    </p>
    <p>
      The meticulous training methodology, combining massive-scale pretraining
      with sophisticated fine-tuning approaches, has produced a model that can
      serve as a foundation for numerous applications. As open-source models
      continue to evolve, Llama 2's architectural innovations will likely
      influence future developments in the field.
    </p>

    <hr />
    <h3>References:</h3>
    <ul>
      <li>
        <a
          href="https://arxiv.org/abs/2307.09288"
          target="_blank"
          rel="noreferrer"
        >
          Llama 2 Technical Report
        </a>
      </li>
      <li>
        <a
          href="https://ai.meta.com/research/publications/llama-2-open-foundation-and-fine-tuned-chat-models/"
          target="_blank"
          rel="noreferrer"
        >
          Llama 2: Open Foundation and Fine-Tuned Chat Models
        </a>
      </li>
      <li>
        <a
          href="https://huggingface.co/docs/transformers/model_doc/llama2"
          target="_blank"
          rel="noreferrer"
        >
          Llama 2 Models on HuggingFace
        </a>
      </li>
      <li>
        <a
          href="https://github.com/NotShrirang/LLM-Garden/tree/main/llama/llama2"
          target="_blank"
          rel="noreferrer"
        >
          My Implementation of Llama 2 on GitHub
        </a>
      </li>
    </ul>
  </div>
);

const slug = title.replace(/\s+/g, "-").replaceAll(":", "").toLowerCase();
const image = cover;
const tags = [
  "Llama",
  "Meta AI",
  "Llama2",
  "LLM",
  "Transformer",
  "Grouped-Query Attention",
  "KV Cache",
  "Attention",
  "Machine Learning",
  "Deep Learning",
];

const date = "2025-04-12";
const readTime = 8;

const Llama2Blog = new BaseBlog(
  title,
  content,
  slug,
  image,
  tags,
  date,
  readTime
);

export default Llama2Blog;
