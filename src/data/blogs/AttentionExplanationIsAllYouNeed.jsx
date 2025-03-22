import Code from "../../utils/codeUtils";
import TenorEmbed from "../../utils/TenorEmbed.jsx";
import BaseBlog from "./BaseBlog";
import cover from "../../assets/images/blogs/Attention/cover.png";
import attentionHeatmap from "../../assets/images/blogs/Attention/attention-heatmap.jpg";

import VectorEmbeddingsBlog from "./VectorEmbeddings.jsx";
import BlogCard from "../../components/BlogCard/BlogCard.jsx";

const title = "Attention: Explanation is All You Need";

const content = (
  <div style={{ textAlign: "justify", width: "100%" }}>
    <p>
      We all know the story of the Transformers. They’re the robots in disguise.
      And what is <b>Attention</b>? It's something Optimus Prime never lacked!
    </p>
    <h3>Okay, bye! Blog is over!</h3>
    <TenorEmbed postId={"658479170644142115"} />
    <p>Haha! Classic Schmosby humor. But let’s get serious now.</p>
    <p>
      We all have used ChatGPT, let's be real. So ChatGPT uses this "Attention".
      But to understand what attention really means, we have to rewind to a time
      before ChatGPT, when the world was a different place. A time when the
      world was ruled by <b>RNNs</b> and <b>CNNs</b>.
    </p>
    <p>
      Back then, Recurrent Neural Networks (RNNs) was the go-to model for many
      natural language processing tasks. We had vanilla RNNs, LSTMs, and GRUs,
      all of which were pretty good at processing sequential data like
      sentences. But they weren’t perfect. They struggled with long-range
      dependencies—basically, if you had to predict the last word in a very long
      sentence, the early parts of the sentence would often fade into a distant
      memory. On top of that, RNNs had trouble being parallelized. You had to
      process tokens step by step, which slowed training.
    </p>
    <p>
      Meanwhile, Convolutional Neural Networks (CNNs) tried to fix some issues
      by capturing local patterns in a more parallel-friendly way. But CNNs had
      their own quirks, like needing deeper layers to capture broader context.
      Enter the big question: “How can we let a model see the entire sequence
      all at once while focusing on the most relevant parts?”
    </p>
    <h2>Attention: The Attention Seeker</h2>
    <p>
      The concept of “attention” was actually around before the Transformer
      paper. Early versions of attention appeared in sequence-to-sequence models
      for tasks like machine translation (especially around 2014-2015). The gist
      was: instead of encoding the entire input sequence into a single hidden
      state (like older RNN-based models did), you could let{" "}
      <b>
        the model “attend” to certain parts of the input sequence more strongly
        when predicting each output token.
      </b>
    </p>
    <p>
      Imagine you’re translating a long sentence from English to French. At each
      step, you might want to look more closely at the English words that
      correspond to the French phrase you’re about to generate. That’s exactly
      what attention did: a set of weights telling you how much to focus on each
      input token at every decoding step.
    </p>
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
        src={attentionHeatmap}
        alt="English to French Attention Heatmap"
      />
      <p style={{ fontSize: "0.8rem" }}>
        <i>English to French Attention Heatmap</i>
      </p>
    </div>
    <p>
      This was a game-changer: it helped preserve long-range context and gave
      more interpretability to the model, because you could visualize the
      attention weights and see where the model was “looking.”
    </p>
    <h3>The Recurrent Problem</h3>
    <p>
      But there was a catch. Even with attention, the underlying RNNs or LSTMs
      were still there. They were like the old chairs with fancy new cushions
      that looked good but still creaked when you sat on them. The key issues
      were:
      <ol>
        <li>
          <b>Sequential Processing:</b> The model still had to process tokens
          one by one, serially. These models were hard to parallelize.
        </li>
        <li>
          <b>Long-Range Dependencies:</b> The RNNs or LSTMs were still
          responsible for capturing long-range dependencies, which they
          struggled with.
        </li>
        <li>
          <b>Exploding and Vanishing Gradients:</b> Training was still difficult
          because of the vanishing and exploding gradient problem.
        </li>
      </ol>
    </p>
    <h2>Transformers: The Attention Revolution</h2>
    <p>
      Then came the Transformer. The bold claim was that we could ditch
      recurrent connections entirely. Instead of stepping through the sequence
      one token at a time, the Transformer uses a mechanism called
      “self-attention,” which compares every token in the sequence with every
      other token simultaneously. That means for each word, the model can figure
      out which other words it should pay more attention to.
    </p>
    <h3>Self-Attention: The Key Idea</h3>
    <p>
      The formula for self-attention is simple: you take the dot product of
      every token with every other token, scale it, apply a softmax to get
      weights, and then take a weighted sum of the token embeddings. This
      weighted sum is the output of self-attention.
    </p>
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
        src={
          "https://sebastianraschka.com/images/blog/2023/self-attention-from-scratch/summary.png"
        }
        alt="Self-Attention Diagram"
      />
      <p style={{ fontSize: "0.8rem" }}>
        <i>Self-Attention</i>
      </p>
    </div>
    <p>
      Formula:
      <Code
        language="python"
        content={`Attention(Q, K, V) = softmax(QK^T / sqrt(d_k))V`}
      />
    </p>
    <p>
      Okay, difficult! Let’s break it down:
      <ul>
        <li>
          <b>Queries, Keys, and Values (Q, K, V)</b>: Each token in the input is
          projected into three vectors: a query vector (Q), a key vector (K),
          and a value vector (V).
        </li>
        <li>
          <b>QK^T:</b> This is the dot product of the Query and Key vectors. It
          tells you how much each token should attend to every other token.
        </li>
        <li>
          <b>sqrt(d_k):</b> This is a scaling factor. It’s the square root of
          the dimension of the Key vectors (Also, it is the embedding
          dimension). It helps stabilize the gradients during training.
        </li>
        <li>
          <b>softmax:</b> This function normalizes the weights so they sum to 1.
          It tells you how much each token should attend to every other token.
        </li>
        <li>
          <b>QK^T / sqrt(d_k):</b> This is the scaled dot product. It tells you
          how much each token should attend to every other token.
        </li>
        <li>
          <b>V:</b> This is the Value vector. It’s the output of self-attention.
          It’s a weighted sum of the Value vectors of all tokens.
        </li>
      </ul>
    </p>
    <p>Implementation in PyTorch</p>
    <Code
      language="python"
      content={`import torch
import torch.nn as nn
from torch.nn import functional as F


class Head(nn.Module):
    """One head of self-attention."""

    def __init__(self, n_embd, head_size, block_size, dropout):
        super().__init__()
        self.key = nn.Linear(n_embd, head_size, bias=False)
        self.query = nn.Linear(n_embd, head_size, bias=False)
        self.value = nn.Linear(n_embd, head_size, bias=False)
        self.register_buffer('tril', torch.tril(torch.ones(block_size, block_size)))
        self.dropout = nn.Dropout(dropout)

    def forward(self, x):
        B, T, C = x.shape
        k = self.key(x)
        q = self.query(x)
        wei = q @ k.transpose(-2, -1) * k.shape[-1] ** -0.5
        wei = wei.masked_fill(self.tril[:T, :T] == 0, float('-inf'))
        wei = F.softmax(wei, dim=-1)
        wei = self.dropout(wei)
        v = self.value(x)
        out = wei @ v
        return out`}
      expander
    />
    <h3>Multi-Head Attention: Doing More</h3>
    <p>
      Instead of computing one single attention distribution, Transformers do
      this multiple times in parallel (each is called a “head”). Each head
      learns to focus on different aspects of the sequence. Then, we concatenate
      the heads back together and pass them through a linear layer.
    </p>
    <p>
      This multi-head trick makes the model more expressive. It can learn
      different relationships in the data at the same time.
    </p>
    <p>
      <p>Formula:</p>
      <Code
        language="python"
        content={`MultiHead(Q, K, V) = Concat(head_1, ..., head_h)W^O`}
      />
    </p>
    <p>Implementation in PyTorch</p>
    <Code
      language="python"
      content={`import torch
import torch.nn as nn
from torch.nn import functional as F


class MultiHeadAttention(nn.Module):
    """Multiple heads of self-attention in parallel."""

    def __init__(self, n_embd, n_head, block_size, dropout):
        super().__init__()
        assert n_embd % n_head == 0, f"n_embd ({n_embd}) must be divisible by num_heads ({n_head})"

        self.n_embd = n_embd
        self.n_head = n_head
        self.head_size = n_embd // n_head

        self.heads = nn.ModuleList([Head(n_embd, self.head_size, block_size, dropout) for _ in range(n_head)])
        self.proj = nn.Linear(n_embd, n_embd)
        self.dropout = nn.Dropout(dropout)

    def forward(self, x):
        out = torch.cat([h(x) for h in self.heads], dim=-1)
        out = self.dropout(self.proj(out))
        return out`}
      expander
    />
    <p>
      Now this is the original version of the Attention provided in the paper
      <a href="https://arxiv.org/pdf/1706.03762" target="_blank">
        “Attention is All You Need.”
      </a>
    </p>
    <p>
      There are infact many other versions of the Attention Mechanism that were
      built on top of this original version. Some of them are:
    </p>
    <ul>
      <li>
        <b>Self-Attention:</b> The original version of the Attention Mechanism.
      </li>
      <li>
        <b>Bidirectional Attention:</b> Each token can look both left and right
        in the sentence.
      </li>
      <li>
        <b>Multi-Query Attention:</b> Instead of having multiple sets of
        queries, keys, and values, we share keys and values across heads while
        keeping separate queries.
      </li>
      <li>
        <b>Infini-Attention:</b> an efficient method to infinitely long inputs
        with bounded memory and computation
      </li>
      <li>
        <b>Sliding Window Attention (Local Attention):</b> This is a variant of
        the Attention Mechanism where each token can only attend to a fixed
        window of tokens around it.
      </li>
      <li>
        <b>Flash Attention:</b> This is the same attention mechanism as the
        vanilla attention, but it uses efficient memory layouts and GPU-friendly
        operations to compute attention with less overhead.
      </li>
    </ul>
    <p>
      Alright, I am not going to bore you with the details of all these
      versions. But I have another blog coming up where I will be explaining
      these versions in detail. So, stay tuned!
    </p>
    <h2>Why Attention Matters?</h2>
    <p>So, why all the fuss about attention? Here’s the bottom line:</p>
    <ul>
      <li>
        <b>Better Long-Range Dependencies:</b> RNNs struggled with forgetting
        old information. Attention can look at the entire sequence, so it
        doesn’t lose track of distant tokens as easily.
      </li>
      <li>
        <b>Parallelization:</b> Transformers process all tokens at once (in the
        self-attention block), which means you can harness the power of GPUs to
        do it in parallel.
      </li>
      <li>
        <b>Flexibility:</b> You can adapt the attention mechanism to different
        tasks—machine translation, summarization, image captioning, code
        generation, and so on.
      </li>
      <li>
        <b>Interpretability:</b> You can visualize attention weights to see
        which words are influencing each other. Although nobody really knows
        what the model is thinking, attention gives you some clues.
      </li>
    </ul>
    <p>
      Attention started as a small improvement to help models focus on relevant
      parts of a sentence. Then it exploded into a full-blown revolution with
      the Transformer architecture, drastically changing how we build language
      models, speech models, and even some vision models. Over time, new flavors
      of attention have popped up to handle large sequences, reduce computation,
      and speed up inference (like Flash Attention and multi-query attention).
      And to make generation efficient, we introduced the KV cache.
    </p>
    <p>
      Right now it really feels like Attention is really all you need. But who
      knows, maybe in the future we will have a new architecture that will make
      us rethink the importance of Attention!
    </p>
    <hr />
    <h3>References:</h3>
    <ul>
      <li>
        <a
          href="https://arxiv.org/pdf/1706.03762"
          target="_blank"
          rel="noreferrer"
        >
          Attention is All You Need
        </a>
      </li>
      <li>
        <a
          href="https://sebastianraschka.com/blog/2023/self-attention-from-scratch.html"
          target="_blank"
          rel="noreferrer"
        >
          Raschka Forever 💯
        </a>
      </li>
    </ul>
    <h3>Source Code</h3>
    <p>
      You can find the source code for my implementation of the Attention
      Mechanism in PyTorch{" "}
      <a
        href="https://github.com/NotShrirang/QuillGPT/blob/main/core/layers/layers.py"
        target="_blank"
        rel="noreferrer"
      >
        here
      </a>
      .
    </p>
    <p>
      Checkout my Decoder Only Transformer implementation:{" "}
      <a
        href="https://github.com/NotShrirang/QuillGPT/"
        target="_blank"
        rel="noreferrer"
      >
        https://github.com/NotShrirang/QuillGPT/
      </a>
    </p>
  </div>
);

const slug = title.replace(/\s+/g, "-").replaceAll(":", "").toLowerCase();
const image = cover;
const tags = [
  "Attention Mechanism",
  "Transformers",
  "Self-Attention",
  "Machine Learning",
  "Deep Learning",
  "LLMs",
];

const date = "March 20th, 2025";
const readTime = 6;

const AttentionBlog = new BaseBlog(
  title,
  content,
  slug,
  image,
  tags,
  date,
  readTime
);

export default AttentionBlog;
