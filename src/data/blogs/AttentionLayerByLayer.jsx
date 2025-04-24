import Code from "../../utils/codeUtils";
import TenorEmbed from "../../utils/TenorEmbed.jsx";
import Expander from "../../utils/Expander.jsx";
import BaseBlog from "./BaseBlog";

import cover from "../../assets/images/blogs/AttentionLayerByLayer/cover.png";
import attentions from "../../assets/images/blogs/AttentionLayerByLayer/attentions.png";
import SelfAttention from "../../assets/images/blogs/AttentionLayerByLayer/self_attention.png";
import MultiHeadAttention from "../../assets/images/blogs/AttentionLayerByLayer/multi_head_attention.png";
import BidirectionalAttention from "../../assets/images/blogs/AttentionLayerByLayer/bidirectional_attention.jpg";
import MultiQueryAttention from "../../assets/images/blogs/AttentionLayerByLayer/multi_query_attention.png";
import GroupedQueryAttention from "../../assets/images/blogs/AttentionLayerByLayer/grouped_query_attention.png";
import InfiniAttention from "../../assets/images/blogs/AttentionLayerByLayer/infini_attention.png";
import SlidingWindowAttention from "../../assets/images/blogs/AttentionLayerByLayer/sliding_window_attention.png";
import FlashAttention from "../../assets/images/blogs/AttentionLayerByLayer/flashattn_banner.jpg";
import FlashAttentionHuggingFace from "../../assets/images/blogs/AttentionLayerByLayer/flash_attention.png";

const title = "Attention and the versions of it: Layer by Layer";

const content = (
  <div style={{ width: "100%" }}>
    <p>
      In the{" "}
      <a
        href="https://shrirangmahajan.in/blogs/attention-explanation-is-all-you-need"
        target="_blank"
        rel="noreferrer"
      >
        last blog
      </a>
      , we talked about the Attention Mechanism and how it revolutionized the
      field of Natural Language Processing. But the vanilla Attention Mechanism
      has its limitations. In this blog, we will discuss the different versions
      of the Attention Mechanism and how they overcome these limitations.
    </p>
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <img width={"60%"} src={attentions} alt="Types of Attention" />
      <p style={{ fontSize: "0.8rem" }}>
        <i>SDPA and Multi - Head Attention</i>
      </p>
    </div>
    <p>Here are some of the attention types mentioned in my last blog:</p>
    <ol>
      <li>
        <a href="#selfAttention" style={{ textDecoration: "none" }}>
          <b>Self Attention</b>
        </a>
      </li>
      <li>
        <a href="#bidirectionalAttention" style={{ textDecoration: "none" }}>
          <b>Bidirectional Attention</b>
        </a>
      </li>
      <li>
        <a href="#motiQueryAttention" style={{ textDecoration: "none" }}>
          <b>Multi-Query Attention</b>
        </a>
      </li>
      <li>
        <a href="#GQA" style={{ textDecoration: "none" }}>
          <b>Grouped Query Attention</b>
        </a>
      </li>
      <li>
        <a href="#infiniAttention" style={{ textDecoration: "none" }}>
          <b>Infini-Attention</b>
        </a>
      </li>
      <li>
        <a href="#slidingWindowAttention" style={{ textDecoration: "none" }}>
          <b>Sliding Window Attention</b>
        </a>
      </li>
      <li>
        <a href="#flashAttention" style={{ textDecoration: "none" }}>
          <b>Flash Attention</b>
        </a>
      </li>
    </ol>
    <p>
      Each of these attention types has its own advantages and disadvantages.
      The choice of attention type depends on the problem at hand and the
      computational resources available. Let's discuss some of the attention
      types in detail.
    </p>
    <p>
      <i>
        I have written explanations of each line of the code for better
        understanding. If you wish to skip the explanation, you may not open the
        expanders.
      </i>
    </p>
    <h2 id="selfAttention">1. Self Attention</h2>
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <img width={"60%"} src={SelfAttention} alt="Self Attention" />
      <p style={{ fontSize: "0.8rem" }}>
        <i>Self Attention</i>
      </p>
    </div>
    <p>
      Self-Attention is the bread and butter of many modern NLP models. In this
      mechanism, every token in a sentence can interact with every other token.
      It’s like a networking event where everyone gets to chat with everyone
      else!
    </p>
    <p>Power Points & Problems</p>
    <ul>
      <li>Power: Captures global dependencies.</li>
      <li>
        Problem: Time complexity being O(n<sup>2</sup>) makes it computationally
        expensive for long sequences.
      </li>
    </ul>
    <p>Code Example: Self-Attention Class</p>
    <Code
      language="python"
      content={`import torch
import torch.nn as nn
from torch.nn import functional as F


class SelfAttention(nn.Module):
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
      expander={false}
      copy
    />
    <Expander>
      <p>
        <b>1. Extracting Dimensions</b>
      </p>
      <p>
        <Code language="python" content={`B, T, C = x.shape`} lineNumber={18} />
      </p>
      <p>
        <strong>What it does:</strong> This line unpacks the shape of the input
        tensor <code>x</code> into three variables:
      </p>
      <p>
        - <strong>B:</strong> Batch size (how many samples are processed
        simultaneously).
      </p>
      <p>
        - <strong>T:</strong> Sequence length (number of tokens or time steps).
      </p>
      <p>
        - <strong>C:</strong> Embedding dimension (the size of the vector
        representation for each token).
      </p>
      <p>
        <strong>Why it's important:</strong> Knowing these dimensions is crucial
        for subsequent tensor operations. Think of it as checking the
        ingredients before you bake a cake.
      </p>
      <p>
        <b>2. Computing Keys</b>
      </p>
      <p>
        <Code language="python" content={`k = self.key(x)`} lineNumber={19} />
      </p>
      <p>
        <strong>What it does:</strong> Applies a linear transformation to the
        input <code>x</code> using the <code>self.key</code> layer, which is a{" "}
        <code>nn.Linear</code> without bias.
      </p>
      <p>
        <strong>Why it's important:</strong> This projects the input data into
        the “key” space, producing a new tensor <code>k</code> that holds key
        vectors for each token. These keys will later be used to calculate
        similarity with queries.
      </p>
      <p>
        <b>3. Computing Queries</b>
      </p>
      <p>
        <Code language="python" content={`q = self.query(x)`} lineNumber={20} />
      </p>
      <p>
        <strong>What it does:</strong> Similar to the previous step, this line
        applies a different linear transformation using the{" "}
        <code>self.query</code> layer to compute query vectors from the input.
      </p>
      <p>
        <strong>Why it's important:</strong> The query vectors <code>q</code>{" "}
        represent what each token is looking for in the other tokens, kind of
        like a detective asking, "Who here is important for me to pay attention
        to?"
      </p>
      <h2>
        <b>4. Calculating Scaled Dot-Product Attention Scores</b>
      </h2>
      <p>
        <Code
          language="python"
          content={`wei = q @ k.transpose(-2, -1) * k.shape[-1] ** -0.5`}
          lineNumber={21}
        />
      </p>
      <p>
        <strong>What it does:</strong>
      </p>
      <p>
        -{" "}
        <strong>
          Matrix Multiplication (<code>q @ k.transpose(-2, -1)</code>):
        </strong>{" "}
        Multiplies the query tensor <code>q</code> with the transposed key
        tensor <code>k</code>. This computes dot products between queries and
        keys, resulting in a tensor of attention scores. The transposition
        ensures the multiplication aligns the embedding dimensions correctly.
      </p>
      <p>
        -{" "}
        <strong>
          Scaling (<code>* k.shape[-1] ** -0.5</code>):
        </strong>{" "}
        Scales the result by the inverse square root of the key dimension (i.e.,{" "}
        <code>1/sqrt(d_k)</code>). This helps keep the gradients in a healthy
        range, especially when the dimensionality is large.
      </p>
      <p>
        <strong>Why it's important:</strong> This line is the heart of the
        self-attention mechanism, determining how much attention each token
        should pay to every other token. Without the scaling factor, the dot
        products could become too large and lead to extremely small gradients
        after the softmax, which would be a training nightmare.
      </p>
      <p>
        <b>5. Applying the Causal Mask</b>
      </p>
      <Code
        content={`wei = wei.masked_fill(self.tril[:T, :T] == 0, float('-inf'))`}
        lineNumber={23}
      />
      <p>
        <strong>What it does:</strong>
      </p>
      <p>
        - <strong>Masking:</strong> Uses the lower-triangular matrix{" "}
        <code>self.tril</code> to mask out (i.e., ignore) the upper triangular
        part of the attention scores.
      </p>
      <p>
        -{" "}
        <strong>
          <code>masked_fill</code>:
        </strong>{" "}
        Replaces the masked (future) positions with negative infinity (
        <code>-inf</code>), instructing the softmax to assign almost zero
        probability to these positions.
      </p>
      <p>
        <strong>Why it's important:</strong> In autoregressive tasks like
        language modeling, you shouldn’t peek into future tokens. This mask
        enforces causality, ensuring that each token can only attend to itself
        and previous tokens.
      </p>
      <p>
        <b>6. Applying Softmax</b>
      </p>
      <p>
        <Code
          language="python"
          content={`wei = F.softmax(wei, dim=-1)`}
          lineNumber={24}
        />
      </p>
      <p>
        <strong>What it does:</strong> Applies the softmax function along the
        last dimension of the tensor, converting the raw attention scores into a
        probability distribution.
      </p>
      <p>
        <strong>Why it's important:</strong> Softmax ensures that the attention
        weights sum up to 1, effectively normalizing the “importance” of each
        token relative to every other token. It’s like converting raw exam
        scores into percentage grades.
      </p>
      <p>
        <b>7. Applying Dropout</b>
      </p>
      <p>
        <Code
          language="python"
          content={`wei = self.dropout(wei)`}
          lineNumber={25}
        />
      </p>
      <p>
        <strong>What it does:</strong> Randomly zeroes some elements in the
        attention weights tensor based on the dropout probability provided.
      </p>
      <p>
        <strong>Why it's important:</strong> Dropout is a regularization
        technique that helps prevent overfitting by ensuring the model doesn't
        become too reliant on any one set of weights. It’s like taking a quick
        break during a marathon to avoid burnout.
      </p>

      <p>
        <b>8. Computing Values</b>
      </p>
      <p>
        <Code language="python" content={`v = self.value(x)`} lineNumber={26} />
      </p>
      <p>
        <strong>What it does:</strong> Applies another linear transformation to
        the input <code>x</code> using the <code>self.value</code> layer to
        compute the value vectors.
      </p>
      <p>
        <strong>Why it's important:</strong> The value vectors <code>v</code>{" "}
        contain the information that will be combined based on the computed
        attention weights. They represent what information is being passed along
        to the next layers.
      </p>

      <p>
        <b>9. Producing the Final Output</b>
      </p>
      <p>
        <Code language="python" content={`out = wei @ v`} lineNumber={27} />
      </p>
      <p>
        <strong>What it does:</strong> Multiplies the attention weights{" "}
        <code>wei</code> with the value vectors <code>v</code>, resulting in a
        weighted sum that aggregates the values based on their corresponding
        attention probabilities.
      </p>
      <p>
        <strong>Why it's important:</strong> This is where the magic of
        self-attention happens. Each token’s final representation is a blend of
        the value vectors of all tokens, weighted by how much attention they
        deserve, like a committee vote where every token’s “voice” is
        considered.
      </p>
    </Expander>
    <p>
      <b>Applications:</b> Self-Attention is used in models like{" "}
      <a
        href="https://arxiv.org/abs/1706.03762"
        target="_blank"
        rel="noreferrer"
      >
        Transformer
      </a>{" "}
      and{" "}
      <a
        href="https://arxiv.org/pdf/2005.14165"
        target="_blank"
        rel="noreferrer"
      >
        GPT-3
      </a>
      .
    </p>
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <img width={"30%"} src={MultiHeadAttention} alt="Multi Head Attention" />
      <p style={{ fontSize: "0.8rem" }}>
        <i>Multi Head Attention</i>
      </p>
    </div>
    <p>
      This is the implementation of the single head of the self-attention
      mechanism that was given in the "Attention is All You Need" paper. The
      same paper also mentions that when multiple heads are used, we get
      performance improvements. This is because each head can learn different
      aspects of the data. This is where the Multi-Head Attention comes into
      play. Multi head attention is the same as self attention but with multiple
      parallel heads.
    </p>
    <h2 id="bidirectionalAttention">2. Bidirectional Attention</h2>
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
        src={BidirectionalAttention}
        alt="Bidirectional Attention"
      />
      <p style={{ fontSize: "0.8rem" }}>
        <i>Bidirectional Attention difference with Self Attention</i>
      </p>
    </div>
    <p>
      Bidirectional Attention allows tokens to look both left and right. Imagine
      being at a party where you’re not just scanning the room to your
      left—you’re scanning every corner. This method is especially useful for
      capturing context from both directions.
    </p>
    <p>Power Points & Problems</p>
    <ul>
      <li>
        Enhanced context understanding by attending to both past and future
        tokens.
      </li>
      <li>
        Problem: Can introduce noise from irrelevant future context if not
        handled properly.
      </li>
    </ul>
    <p>Code Example: Bidirectional Attention Class</p>
    <Code
      language="python"
      content={`class BidirectionalAttention(nn.Module):
    def __init__(self, embed_size):
        super(BidirectionalAttention, self).__init__()
        self.W_q = nn.Linear(embed_size, embed_size)
        self.W_k = nn.Linear(embed_size, embed_size)
        self.W_v = nn.Linear(embed_size, embed_size)
    
    def forward(self, x):
        Q = self.W_q(x)
        K = self.W_k(x)
        V = self.W_v(x)
        scores = torch.matmul(Q, K.transpose(-2, -1)) / math.sqrt(x.size(-1))
        attention = torch.softmax(scores, dim=-1)
        return torch.matmul(attention, V)`}
      expander={false}
      copy
    />
    <Expander>
      <p>
        <b>1. Computing Query, Key, and Value Matrices</b>
      </p>
      <p>
        <Code language="python" content={`Q = self.W_q(x)`} lineNumber={9} />
      </p>
      <p>
        <Code language="python" content={`K = self.W_k(x)`} lineNumber={10} />
      </p>
      <p>
        <Code language="python" content={`V = self.W_v(x)`} lineNumber={11} />
      </p>
      <p>
        <strong>What it does:</strong> The input tensor <code>x</code> is
        linearly transformed using three separate weight matrices:{" "}
        <code>W_q</code>, <code>W_k</code>, and <code>W_v</code>. These
        represent the queries, keys, and values, respectively.
      </p>
      <p>
        <strong>Why it's important:</strong> This transformation projects the
        input into different spaces, which allows the model to determine
        attention scores based on the relationships between queries and keys.
      </p>
      <p>
        <b>2. Computing Attention Scores</b>
      </p>
      <p>
        <Code
          language="python"
          content={`scores = torch.matmul(Q, K.transpose(-2, -1)) / math.sqrt(x.size(-1))`}
          lineNumber={12}
        />
      </p>
      <p>
        <strong>What it does:</strong>
      </p>
      <ul>
        <li>
          <strong>Dot Product:</strong> The query matrix <code>Q</code> is
          multiplied with the transposed key matrix <code>K</code>, producing a
          similarity score for each pair of elements.
        </li>
        <li>
          <strong>Scaling:</strong> The scores are divided by the square root of
          the embedding size. This prevents large values from dominating the
          softmax operation later, ensuring more stable gradients.
        </li>
      </ul>
      <p>
        <strong>Why it's important:</strong> The attention scores determine how
        much focus each token should place on every other token.
      </p>
      <p>
        <b>3. Applying Softmax to Obtain Attention Weights</b>
      </p>
      <p>
        <Code
          language="python"
          content={`attention = torch.softmax(scores, dim=-1)`}
          lineNumber={13}
        />
      </p>
      <p>
        <strong>What it does:</strong> Applies the softmax function along the
        last dimension, normalizing the scores into probabilities that sum to 1.
      </p>
      <p>
        <strong>Why it's important:</strong> This converts raw attention scores
        into meaningful weights, determining how much each token contributes to
        the final representation.
      </p>
      <p>
        <b>4. Computing the Final Output</b>
      </p>
      <p>
        <Code
          language="python"
          content={`return torch.matmul(attention, V)`}
          lineNumber={14}
        />
      </p>
      <p>
        <strong>What it does:</strong> The computed attention weights are
        multiplied by the value matrix <code>V</code>, generating a weighted sum
        of values.
      </p>
      <p>
        <strong>Why it's important:</strong> This step produces the final
        representation of each token, considering information from all other
        tokens according to their computed importance.
      </p>
    </Expander>
    <p>
      <b>Applications:</b> Bidirectional Attention is used in models like{" "}
      <a
        href="https://arxiv.org/pdf/1810.04805"
        target="_blank"
        rel="noreferrer"
      >
        BERT
      </a>{" "}
      and{" "}
      <a
        href="https://arxiv.org/pdf/1910.10683"
        target="_blank"
        rel="noreferrer"
      >
        T5
      </a>
      .
    </p>
    <h2 id="multiQueryAttention">3. Multi - Query Attention</h2>
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <img
        width={"100%"}
        src={MultiQueryAttention}
        alt="Multi Query Attention"
      />
      <p style={{ fontSize: "0.8rem" }}>
        <i>Multi Query Attention</i>
      </p>
    </div>
    <p>
      Multi-Query Attention streamlines computation by sharing keys and values
      across heads, while still allowing separate queries. It’s like ordering
      one giant pizza and letting everyone take a slice instead of making
      multiple orders efficient, yet flexible.
    </p>
    <p>Power Points & Problems</p>
    <ul>
      <li>Reduces computation by sharing key and value matrices.</li>
      <li>
        Problem: Can lead to less diversity in attention patterns across heads.
      </li>
    </ul>
    <p>Code Example: Multi-Query Attention Class</p>
    <Code
      language="python"
      content={`class MultiQueryAttention(nn.Module):
    def __init__(self, embed_size, heads):
        super(MultiQueryAttention, self).__init__()
        self.embed_size = embed_size
        self.heads = heads
        self.head_dim = embed_size // heads
        self.W_q = nn.Linear(embed_size, embed_size)
        self.W_kv = nn.Linear(embed_size, embed_size * 2)
        self.fc_out = nn.Linear(embed_size, embed_size)

    def forward(self, x):
        batch_size, seq_length, _ = x.shape
        Q = self.W_q(x)
        kv = self.W_kv(x)
        kv = kv.view(batch_size, seq_length, 2, self.embed_size)
        K, V = kv[:, :, 0, :], kv[:, :, 1, :]
        Q = Q.view(batch_size, seq_length, self.heads, self.head_dim).transpose(1, 2)
        K = K.view(batch_size, seq_length, self.heads, self.head_dim).transpose(1, 2)
        V = V.view(batch_size, seq_length, self.heads, self.head_dim).transpose(1, 2)
        scores = torch.matmul(Q, K.transpose(-2, -1)) / math.sqrt(self.head_dim)
        attention = torch.softmax(scores, dim=-1)
        out = torch.matmul(attention, V)
        out = out.transpose(1, 2).contiguous().view(batch_size, seq_length, self.embed_size)
        return self.fc_out(out)`}
      expander={false}
      copy
    />
    <Expander>
      <p>
        <b>1. Extracting Input Dimensions</b>
      </p>
      <p>
        <Code
          language="python"
          content={`batch_size, seq_length, _ = x.shape`}
          lineNumber={12}
        />
      </p>
      <p>
        <strong>What it does:</strong> Unpacks the shape of the input tensor{" "}
        <code>x</code> into three variables: <code>batch_size</code> (number of
        sequences), <code>seq_length</code> (number of tokens per sequence), and
        an unused embedding dimension.
      </p>
      <p>
        <strong>Why it's important:</strong> It’s like checking your ingredients
        before cooking—knowing the size and structure of your input is essential
        for all subsequent operations.
      </p>

      <p>
        <b>2. Computing the Query Matrix</b>
      </p>
      <p>
        <Code language="python" content={`Q = self.W_q(x)`} lineNumber={13} />
      </p>
      <p>
        <strong>What it does:</strong> Passes the input <code>x</code> through
        the linear layer <code>W_q</code> to produce the query tensor{" "}
        <code>Q</code>.
      </p>
      <p>
        <strong>Why it's important:</strong> Queries represent what each token
        is “asking” of the other tokens, setting the stage for the attention
        mechanism.
      </p>

      <p>
        <b>3. Computing Combined Keys and Values</b>
      </p>
      <p>
        <Code language="python" content={`kv = self.W_kv(x)`} lineNumber={14} />
      </p>
      <p>
        <strong>What it does:</strong> Processes the input <code>x</code> with
        the linear layer <code>W_kv</code> to generate a combined tensor for
        keys and values.
      </p>
      <p>
        <strong>Why it's important:</strong> This efficient trick computes both
        keys and values in one go, reducing computational redundancy.
      </p>

      <p>
        <b>4. Reshaping the Combined Tensor</b>
      </p>
      <p>
        <Code
          language="python"
          content={`kv = kv.view(batch_size, seq_length, 2, self.embed_size)`}
          lineNumber={15}
        />
      </p>
      <p>
        <strong>What it does:</strong> Reshapes the <code>kv</code> tensor to
        add an extra dimension that separates the keys and values.
      </p>
      <p>
        <strong>Why it's important:</strong> Organizes the tensor into two
        compartments—one for keys and one for values—making it easier to work
        with them separately.
      </p>

      <p>
        <b>5. Splitting Keys and Values</b>
      </p>
      <p>
        <Code
          language="python"
          content={`K, V = kv[:, :, 0, :], kv[:, :, 1, :]`}
          lineNumber={16}
        />
      </p>
      <p>
        <strong>What it does:</strong> Separates the combined tensor into two
        distinct tensors: <code>K</code> for keys and <code>V</code> for values.
      </p>
      <p>
        <strong>Why it's important:</strong> Clearly delineates the roles: keys
        help determine attention while values carry the information.
      </p>

      <p>
        <b>6. Reshaping and Transposing the Query Tensor</b>
      </p>
      <p>
        <Code
          language="python"
          content={`Q = Q.view(batch_size, seq_length, self.heads, self.head_dim).transpose(1, 2)`}
          lineNumber={17}
        />
      </p>
      <p>
        <strong>What it does:</strong> Reshapes <code>Q</code> to separate out
        multiple attention heads and transposes it to bring the heads dimension
        to the front.
      </p>
      <p>
        <strong>Why it's important:</strong> This setup enables the model to
        attend to different features in parallel, like having multiple pairs of
        eyes observing different aspects of the data.
      </p>

      <p>
        <b>7. Reshaping and Transposing the Key Tensor</b>
      </p>
      <p>
        <Code
          language="python"
          content={`K = K.view(batch_size, seq_length, self.heads, self.head_dim).transpose(1, 2)`}
          lineNumber={18}
        />
      </p>
      <p>
        <strong>What it does:</strong> Similar to the queries, <code>K</code> is
        reshaped and transposed to align with the multi-head format.
      </p>
      <p>
        <strong>Why it's important:</strong> Ensures that each attention head
        processes its corresponding slice of the key tensor.
      </p>

      <p>
        <b>8. Reshaping and Transposing the Value Tensor</b>
      </p>
      <p>
        <Code
          language="python"
          content={`V = V.view(batch_size, seq_length, self.heads, self.head_dim).transpose(1, 2)`}
          lineNumber={19}
        />
      </p>
      <p>
        <strong>What it does:</strong> The <code>V</code> tensor is reshaped and
        transposed in the same way as <code>Q</code> and <code>K</code>.
      </p>
      <p>
        <strong>Why it's important:</strong> Aligns the values with their
        corresponding queries and keys, ensuring consistency across all heads.
      </p>

      <p>
        <b>9. Calculating Scaled Dot-Product Attention Scores</b>
      </p>
      <p>
        <Code
          language="python"
          content={`scores = torch.matmul(Q, K.transpose(-2, -1)) / math.sqrt(self.head_dim)`}
          lineNumber={20}
        />
      </p>
      <p>
        <strong>What it does:</strong> Multiplies <code>Q</code> with the
        transposed <code>K</code> to obtain raw attention scores, then scales
        them by the square root of the head dimension.
      </p>
      <p>
        <strong>Why it's important:</strong> Scaling keeps the scores in a
        manageable range, preventing extremely high values that could ruin the
        softmax operation—like keeping the volume at a reasonable level.
      </p>

      <p>
        <b>10. Applying Softmax to Obtain Attention Weights</b>
      </p>
      <p>
        <Code
          language="python"
          content={`attention = torch.softmax(scores, dim=-1)`}
          lineNumber={21}
        />
      </p>
      <p>
        <strong>What it does:</strong> Converts the raw scores into a
        probability distribution over tokens using softmax.
      </p>
      <p>
        <strong>Why it's important:</strong> Normalizes the attention scores so
        that they sum to 1, determining how much focus each token should get.
      </p>

      <p>
        <b>11. Combining Values with Attention Weights</b>
      </p>
      <p>
        <Code
          language="python"
          content={`out = torch.matmul(attention, V)`}
          lineNumber={22}
        />
      </p>
      <p>
        <strong>What it does:</strong> Uses the attention weights to compute a
        weighted sum of the value vectors.
      </p>
      <p>
        <strong>Why it's important:</strong> Aggregates information from all
        tokens based on their importance, creating a context-aware
        representation.
      </p>

      <p>
        <b>12. Reordering and Reshaping the Output</b>
      </p>
      <p>
        <Code
          language="python"
          content={`out = out.transpose(1, 2).contiguous().view(batch_size, seq_length, self.embed_size)`}
          lineNumber={23}
        />
      </p>
      <p>
        <strong>What it does:</strong> Transposes and reshapes the output tensor
        to collapse the multiple heads back into the original embedding
        dimension.
      </p>
      <p>
        <strong>Why it's important:</strong> Reassembles the multi-head outputs
        into a unified tensor that subsequent layers can process.
      </p>

      <p>
        <b>13. Final Linear Transformation</b>
      </p>
      <p>
        <Code
          language="python"
          content={`return self.fc_out(out)`}
          lineNumber={24}
        />
      </p>
      <p>
        <strong>What it does:</strong> Applies a final linear transformation to
        mix the information from all heads.
      </p>
      <p>
        <strong>Why it's important:</strong> Integrates the multi-head attention
        outputs into a cohesive representation for the next stage of processing.
      </p>
    </Expander>
    <p>
      <b>Applications:</b> Multi-Query Attention is used in models like{" "}
      <a
        href="https://arxiv.org/pdf/2204.02311"
        target="_blank"
        rel="noreferrer"
      >
        PaLM
      </a>{" "}
      and{" "}
      <a
        href="https://arxiv.org/pdf/2311.16867"
        target="_blank"
        rel="noreferrer"
      >
        Falcon
      </a>
      .
    </p>
    <h2 id="GQA">4. Grouped Query Attention</h2>
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <img
        width={"100%"}
        src={GroupedQueryAttention}
        alt="Grouped Query Attention"
      />
      <p style={{ fontSize: "0.8rem" }}>
        <i>Grouped Query Attention</i>
      </p>
    </div>
    <p>
      Grouped Query Attention (GQA) is an efficient variant of multi-head
      attention that reduces computational cost while maintaining strong
      performance.
    </p>
    <p>
      Instead of each query attending to separate key-value heads, GQA groups
      queries together and shares key-value projections within each group. This
      reduces memory usage and speeds up inference, making it particularly
      useful for large-scale models like LLaMA and GPT variants.
    </p>
    <p>
      GQA strikes a balance between Multi-Query Attention (MQA), which uses a
      single shared key-value pair, and full Multi-Head Attention (MHA), which
      has independent key-value pairs for each head. By leveraging grouped keys
      and values, GQA achieves high efficiency with minimal accuracy loss,
      making it widely used in modern LLMs for scalable and cost-effective
      deployment.
    </p>
    <Code
      language="python"
      content={`class GroupedQueryAttention(nn.Module):
    def __init__(self, embed_size, num_heads, num_groups):
        super(GroupedQueryAttention, self).__init__()
        self.embed_size = embed_size
        self.num_heads = num_heads
        self.num_groups = num_groups
        self.head_dim = embed_size // num_heads
        
        assert num_heads % num_groups == 0, "Number of heads must be divisible by number of groups"
        
        self.W_q = nn.Linear(embed_size, embed_size)
        self.W_kv = nn.Linear(embed_size, embed_size * 2)  # Shared keys and values across groups
        self.fc_out = nn.Linear(embed_size, embed_size)

    def forward(self, x):
        batch_size, seq_length, _ = x.shape

        # Compute queries normally
        Q = self.W_q(x)
        Q = Q.view(batch_size, seq_length, self.num_heads, self.head_dim).transpose(1, 2)  # (B, heads, L, head_dim)

        # Compute shared keys and values across groups
        kv = self.W_kv(x)
        kv = kv.view(batch_size, seq_length, 2, self.num_groups, self.embed_size // self.num_groups)
        K, V = kv[:, :, 0, :, :], kv[:, :, 1, :, :]
        
        # Expand keys and values to match number of heads per group
        heads_per_group = self.num_heads // self.num_groups
        K = K.repeat_interleave(heads_per_group, dim=2)
        V = V.repeat_interleave(heads_per_group, dim=2)

        # Compute attention
        scores = torch.matmul(Q, K.transpose(-2, -1)) / math.sqrt(self.head_dim)
        attention = torch.softmax(scores, dim=-1)
        out = torch.matmul(attention, V)

        # Reshape and project output
        out = out.transpose(1, 2).contiguous().view(batch_size, seq_length, self.embed_size)
        return self.fc_out(out)`}
      expander={false}
      copy
    />
    <Expander>
      <p>
        <b>1. Extract batch size and sequence length from input shape</b>
        <Code
          language="python"
          content={`batch_size, seq_length, _ = x.shape`}
          lineNumber={16}
        />
        <p>
          Retrieves the batch size and sequence length from the input tensor x,
          ignoring the embedding dimension.
        </p>
      </p>
      <p>
        <b>2. Compute queries</b>
        <Code language="python" content={`Q = self.W_q(x)`} lineNumber={19} />
        <p>
          Applies the learnable weight matrix W_q to project x into the query
          space.
        </p>
      </p>
      <p>
        <b>3. Reshape and transpose queries</b>
        <Code
          language="python"
          content={`Q = Q.view(batch_size, seq_length, self.num_heads, self.head_dim).transpose(1, 2)`}
          lineNumber={20}
        />
        <p>
          Reshapes <i>Q</i> into{" "}
          <i>(batch_size, seq_length, num_heads, head_dim)</i> and transposes to{" "}
          <i>(batch_size, num_heads, seq_length, head_dim)</i>.
        </p>
      </p>
      <p>
        <b>4. Compute shared keys and values</b>
        <Code language="python" content={`kv = self.W_kv(x)`} lineNumber={23} />
        <p>
          Uses a single linear layer W_kv to compute both key and value matrices
          simultaneously.
        </p>
      </p>
      <p>
        <b>5. Reshape and split keys and values</b>
        <Code
          language="python"
          content={`kv = kv.view(batch_size, seq_length, 2, self.num_groups, self.embed_size // self.num_groups)`}
          lineNumber={24}
        />
        <p>
          Reshapes the kv tensor into{" "}
          <i>
            (batch_size, seq_length, 2, num_groups, embed_size // num_groups)
          </i>
          , separating keys and values into distinct groups.
        </p>
      </p>
      <p>
        <b>6. Extract key and value tensors separately</b>
        <Code
          language="python"
          content={`K, V = kv[:, :, 0, :, :], kv[:, :, 1, :, :]`}
          lineNumber={25}
        />
        <p>Extracts the key and value tensors from the reshaped kv tensor.</p>
      </p>
      <p>
        <b>7. Expand keys to match the number of heads per group</b>
        <Code
          language="python"
          content={`heads_per_group = self.num_heads // self.num_groups\nK = K.repeat_interleave(heads_per_group, dim=2)`}
          lineNumber={28}
        />
        <p>
          Repeats each key tensor within a group to match the number of heads
          per group.
        </p>
      </p>
      <p>
        <Code
          language="python"
          content={`V = V.repeat_interleave(heads_per_group, dim=2)`}
          lineNumber={30}
        />
        <p>
          Repeats each value tensor within a group to match the number of heads
          per group.
        </p>
      </p>
      <p>
        <b>8. Compute attention scores</b>
        <Code
          language="python"
          content={`scores = torch.matmul(Q, K.transpose(-2, -1)) / math.sqrt(self.head_dim)`}
          lineNumber={33}
        />
        <p>
          Computes the attention scores by taking the dot product of queries and
          keys, scaled by the square root of the head dimension.
        </p>
      </p>
      <p>
        <b>9. Apply softmax to obtain attention weights</b>
        <Code
          language="python"
          content={`attention = torch.softmax(scores, dim=-1)`}
          lineNumber={34}
        />
        <p>
          Applies the softmax function along the last dimension to obtain
          attention weights.
        </p>
      </p>
      <p>
        <b>10. Combine values with attention weights</b>
        <Code
          language="python"
          content={`out = torch.matmul(attention, V)`}
          lineNumber={35}
        />
        <p>Computes the weighted sum of values using the attention weights.</p>
      </p>
      <p>
        <b>11. Reshape and project output</b>
        <Code
          language="python"
          content={`out = out.transpose(1, 2).contiguous().view(batch_size, seq_length, self.embed_size)`}
          lineNumber={38}
        />
        <p>
          Transposes and reshapes the output tensor to match the original
          embedding size.
        </p>
      </p>
      <p>
        <b>12. Final linear transformation</b>
        <Code
          language="python"
          content={`return self.fc_out(out)`}
          lineNumber={39}
        />
        <p>
          Applies a final linear transformation to the output tensor to mix
          information across heads.
        </p>
      </p>
    </Expander>
    <p>
      <b>Applications:</b> Grouped Query Attention is used in models like{" "}
      <a
        href="https://arxiv.org/pdf/2307.09288"
        target="_blank"
        rel="noreferrer"
      >
        LLaMA 2 - 70B
      </a>{" "}
      and{" "}
      <a
        href="https://arxiv.org/pdf/2310.06825"
        target="_blank"
        rel="noreferrer"
      >
        Mistral 7B
      </a>
      .
    </p>
    <h2 id="infiniAttention">5. Infini-Attention</h2>
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <img width={"60%"} src={InfiniAttention} alt="Infini Attention" />
      <p style={{ fontSize: "0.8rem" }}>
        <i>Infini Attention</i>
      </p>
    </div>
    <p>
      Infini-Attention tackles the problem of long sequences by processing
      infinitely long inputs with bounded memory and computation. Think of it as
      an attention mechanism that can handle a marathon of tokens without
      breaking a sweat.
    </p>
    <p>
      This make LLM scalable to very long sequences. But the complexity of
      design and potential approximations might hurt precision.
    </p>
    <p>Code Example: Infini-Attention Class</p>
    <Code
      language="python"
      content={`class InfiniAttention(nn.Module):
    def __init__(self, 
      seq_len: int,
      emb_dim: int,
      d_head: int,
      n_head: int,
      n_segments: int,
      is_causal: Optional[bool] = True,
      update: Optional[str] = 'linear', 
      device: Optional[str] = 'cpu',
      scale:Optional[int] = 10
    ):
        super().__init__()

        """
        Args:
        seq_len: Sequence length of the inputs.
        n_segments: Number of segments (must be divisible to seq_len).
        n_head: Number of attention heads.
        emb_dim: Embedding dimension of the input.
        d_head: Embedding dimension of each head.
        is_causal: Whether the model causal or not.
        device: cuda or cpu.
        """
        if update not in ['linear', 'delta']:
            raise ValueError('Update takes only one of these parameters - linear, delta')
        
        assert seq_len % n_segments == 0, 'seq_len must be divisible to n_segments'
        assert emb_dim % n_head == 0, 'emb_dim must be divisible to n_head'

        self.seq_len = seq_len
        self.n_segments = n_segments
        self.n_head = n_head
        self.emb_dim = emb_dim
        self.d_head = d_head
        self.is_causal = is_causal
        self.use_rope = use_rope
        self.update = update
        self.device = device
        self.scale = scale
        self.beta = nn.Parameter(torch.zeros((1,self.n_head,1,1))) # -> A learnable scalar from the paper.
        self.q = nn.Linear(emb_dim, emb_dim, device=device)
        self.k = nn.Linear(emb_dim, emb_dim, device=device)
        self.v = nn.Linear(emb_dim, emb_dim, device=device)
        self.o = nn.Linear(emb_dim, emb_dim, device=device)
        self.elu = nn.ELU()
        self.freq_cis = RoPE.compute_freq_cis(emb_dim, seq_len, 10000.0, device=device)
        self.register_buffer('causal', torch.tril(torch.ones(seq_len // n_segments, seq_len // n_segments, device=device)))

    def forward(self, x: torch.Tensor) -> torch.Tensor:

        batch_size, _, _ = x.size()

        #There was no guide for initialization for the parameters below, so I just initialize them fron zero.
        memory = torch.zeros((self.n_head, self.d_head, self.d_head)).to(self.device)
        z = torch.zeros((self.n_head, self.d_head, 1)).to(self.device)

        query = self.q(x)
        key = self.k(x)
        value = self.v(x)

        query = query.view(batch_size, self.n_head, self.n_segments, self.seq_len // self.n_segments, self.d_head)
        key = key.view(batch_size, self.n_head, self.n_segments, self.seq_len // self.n_segments, self.d_head)
        value = value.view(batch_size, self.n_head, self.n_segments, self.seq_len // self.n_segments, self.d_head)

        output = []

        for idx in range(self.n_segments):

            sigma_q = self.elu(query[:, :, idx, :, :]) + 1.0
            sigma_k = self.elu(key[:, :, idx, :, :]) + 1.0
            A_mem = (sigma_q @ memory) / ((sigma_q @ z) + 1e-6)  # Adding 1e-6 for preventing division to 0

            A_dot = query[:, :, idx, :, :] @ key[:, :, idx, :, :].transpose(-2, -1)
            
            if self.is_causal:
              A_dot.masked_fill_(self.causal == 0, float('-inf'))

            A_dot = F.softmax(A_dot / torch.sqrt(torch.tensor(self.d_head)), dim = -1)
            A_dot =  A_dot @ value[:, :, idx, :, :]

            attention = (F.sigmoid(self.beta*self.scale) * A_mem) + ((1 - F.sigmoid(self.beta*self.scale)) * A_dot)

            #Update
            if self.update == 'linear':
                memory = memory + (sigma_k.transpose(-2, -1) @ value[:, :, idx, :, :])
            else:
                delta = (sigma_k @ memory) / ((sigma_k @ z) + 1e-6)
                memory = memory + (sigma_k.transpose(-2, -1) @ (value[:, :, idx, :, :] - delta))
            
            z = z + sigma_k.sum(dim = -2, keepdim = True)

            output.append(attention)
        
        attention = torch.concat(output, dim = 2).view(batch_size, self.seq_len, self.emb_dim)
        return self.o(attention)`}
      expander={false}
      copy
    />
    <p>
      Credit:{" "}
      <a href="https://github.com/vmarinowski/infini-attention">
        https://github.com/vmarinowski/infini-attention
      </a>
    </p>
    <Expander>
      <p>
        <b>Extract batch size:</b>
        <Code
          language="python"
          content={`batch_size, _, _ = x.size()`}
          lineNumber={52}
        />
        <p>Extracts the batch size from the input tensor x.</p>
      </p>
      <p>
        <b>Initialize memory and update vector:</b>
        <Code
          language="python"
          content={`memory = torch.zeros((self.n_head, self.d_head, self.d_head)).to(self.device)\nz = torch.zeros((self.n_head, self.d_head, 1)).to(self.device)`}
          lineNumber={55}
        />
        <p>Creates tensors memory and z, both initialized to zero.</p>
      </p>
      <p>
        <b>Compute query, key, and value:</b>
        <Code
          language="python"
          content={`query = self.q(x)
key = self.k(x)
value = self.v(x)`}
          lineNumber={58}
        />
        <p>Projects the input x into query, key, and value spaces.</p>
      </p>
      <p>
        <b>Reshape for multi-head attention:</b>
        <Code
          language="python"
          content={`query = query.view(batch_size, self.n_head, self.n_segments, self.seq_len // self.n_segments, self.d_head)\nkey = key.view(batch_size, self.n_head, self.n_segments, self.seq_len // self.n_segments, self.d_head)\nvalue = value.view(batch_size, self.n_head, self.n_segments, self.seq_len // self.n_segments, self.d_head)`}
          lineNumber={62}
        />
        <p>
          Splits query, key, and value into multiple attention heads and
          segments.
        </p>
      </p>
      <p>
        <b>Initialize an output list:</b>
        <Code language="python" content={`output = []`} lineNumber={66} />
        <p>Creates an empty list to store attention outputs.</p>
      </p>
      <p>
        <b>Loop over segments:</b>
        <Code
          language="python"
          content={`for idx in range(self.n_segments):`}
          lineNumber={68}
        />
        <p>Iterates over each segment of the input sequence.</p>
      </p>
      <p>
        <b>Compute sigma_q and sigma_k:</b>
        <Code
          language="python"
          content={`sigma_q = self.elu(query[:, :, idx, :, :]) + 1.0\nsigma_k = self.elu(key[:, :, idx, :, :]) + 1.0`}
          lineNumber={70}
        />
        <p>Applies ELU activation and shifts values to be positive.</p>
      </p>
      <p>
        <b>Compute A_mem:</b>
        <Code
          language="python"
          content={`A_mem = (sigma_q @ memory) / ((sigma_q @ z) + 1e-6)`}
          lineNumber={72}
        />
        <p>
          Uses memory to compute attention, normalizing by z to prevent division
          by zero.
        </p>
      </p>
      <p>
        <b>Compute A_dot:</b>
        <Code
          language="python"
          content={`A_dot = query[:, :, idx, :, :] @ key[:, :, idx, :, :].transpose(-2, -1)`}
          lineNumber={74}
        />
        <p>Performs standard dot-product attention.</p>
      </p>
      <p>
        <b>Apply causal masking:</b>
        <Code
          language="python"
          content={`if self.is_causal:\n    A_dot.masked_fill_(self.causal == 0, float('-inf'))`}
          lineNumber={76}
        />
        <p>
          Masks out future tokens to ensure causality in the attention
          mechanism.
        </p>
      </p>
      <p>
        <b>Compute softmax:</b>
        <Code
          language="python"
          content={`A_dot = F.softmax(A_dot / torch.sqrt(torch.tensor(self.d_head)), dim = -1)`}
          lineNumber={79}
        />
        <p>
          Applies softmax to obtain attention weights. Normalizes scores using
          softmax with scaling.
        </p>
      </p>
      <p>
        <b>Compute value-weighted attention scores:</b>
        <Code
          language="python"
          content={`A_dot =  A_dot @ value[:, :, idx, :, :]`}
          lineNumber={80}
        />
        <p>Computes the weighted sum of values using the attention weights.</p>
      </p>
      <p>
        <b>Compute final attention mix:</b>
        <Code
          language="python"
          content={`attention = (F.sigmoid(self.beta*self.scale) * A_mem) + ((1 - F.sigmoid(self.beta*self.scale)) * A_dot)`}
          lineNumber={82}
        />
        <p>
          Uses a learnable weight beta to blend memory-based and standard
          attention.
        </p>
      </p>
      <p>
        <b>Update memory:</b>
        <Code
          language="python"
          content={`if self.update == 'linear':
    memory = memory + (sigma_k.transpose(-2, -1) @ value[:, :, idx, :, :])
else:
    delta = (sigma_k @ memory) / ((sigma_k @ z) + 1e-6)
    memory = memory + (sigma_k.transpose(-2, -1) @ (value[:, :, idx, :, :] - delta))`}
          lineNumber={86}
        />
        <p>
          Updates memory based on sigma_k and the update rule (linear or delta).
        </p>
      </p>
      <p>
        <b>Update z tensor:</b>
        <Code
          language="python"
          content={`z = z + sigma_k.sum(dim = -2, keepdim = True)`}
          lineNumber={91}
        />
        <p>Accumulates sigma_k values for normalization.</p>
      </p>
      <p>
        <b>Store attention output:</b>
        <Code
          language="python"
          content={`output.append(attention)`}
          lineNumber={93}
        />
        <p>Saves computed attention for this segment.</p>
      </p>
      <p>
        <b>Concatenate segment outputs:</b>
        <Code
          language="python"
          content={`attention = torch.concat(output, dim = 2).view(batch_size, self.seq_len, self.emb_dim)`}
          lineNumber={95}
        />
        <p>Joins segment-wise outputs into a single sequence.</p>
      </p>
      <p>
        <b>Apply output projection:</b>
        <Code
          language="python"
          content={`return self.o(attention)`}
          lineNumber={96}
        />
        <p>Projects the attention output to the final embedding dimension.</p>
      </p>
    </Expander>
    <p>
      Although Infini-Attention is a powerful tool for handling long sequences,
      it's not yet a widely adopted feature in mainstream LLMs. The complexity
      of the design and potential approximations may hinder its widespread use.
      However, as the demand for processing longer sequences grows,
      Infini-Attention could become a key component in future models.
    </p>
    <h2 id="slidingWindowAttention">6. Sliding Window Attention</h2>
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <img
        width={"100%"}
        src={SlidingWindowAttention}
        alt="Sliding Window Attention"
      />
      <p style={{ fontSize: "0.8rem" }}>
        <i>Sliding Window Attention</i>
      </p>
    </div>
    <p>
      Sliding Window or Local Attention restricts each token’s view to a fixed
      window. It’s like a gossip session where you only hear what’s happening in
      your immediate vicinity—not the entire neighborhood.
    </p>
    <p>
      This method reduces the computational complexity of attention by limiting
      the interactions between tokens. By focusing on local context, it can
      efficiently handle long sequences without sacrificing performance.
    </p>
    <p>Coding Example: Sliding Window Attention Class</p>
    <Code
      language="python"
      content={`class SlidingWindowAttention(nn.Module):
    def __init__(self, embed_size, window_size):
        super(SlidingWindowAttention, self).__init__()
        self.embed_size = embed_size
        self.window_size = window_size
        self.W_q = nn.Linear(embed_size, embed_size)
        self.W_k = nn.Linear(embed_size, embed_size)
        self.W_v = nn.Linear(embed_size, embed_size)
    
    def forward(self, x):
        batch_size, seq_length, _ = x.shape
        Q = self.W_q(x)
        K = self.W_k(x)
        V = self.W_v(x)
        outputs = []
        for i in range(seq_length):
            start = max(0, i - self.window_size)
            end = min(seq_length, i + self.window_size + 1)
            Q_i = Q[:, i:i+1, :]
            K_window = K[:, start:end, :]
            V_window = V[:, start:end, :]
            scores = torch.matmul(Q_i, K_window.transpose(-2, -1)) / math.sqrt(x.size(-1))
            attention = torch.softmax(scores, dim=-1)
            outputs.append(torch.matmul(attention, V_window))
        return torch.cat(outputs, dim=1)`}
      expander={false}
      copy
    />
    <Expander>
      <p>
        <b>1. Extract batch size and sequence length:</b>
        <Code
          language="python"
          content={`batch_size, seq_length, _ = x.shape`}
          lineNumber={11}
        />
        <p>
          Retrieves the batch size and sequence length from the input tensor x.
        </p>
      </p>
      <p>
        <b>Compute queries, keys, and values:</b>
        <Code
          language="python"
          content={`Q = self.W_q(x)\nK = self.W_k(x)\nV = self.W_v(x)`}
          lineNumber={12}
        />
        <p>Projects the input x into query, key, and value spaces.</p>
      </p>
      <p>
        <b>Initialize an output list:</b>
        <Code language="python" content={`outputs = []`} lineNumber={15} />
        <p>Creates an empty list to store attention outputs.</p>
      </p>
      <p>
        <b>Loop over tokens:</b>
        <Code
          language="python"
          content={`for i in range(seq_length):`}
          lineNumber={16}
        />
        <p>Iterates over each token in the input sequence.</p>
      </p>
      <p>
        <b>Compute window boundaries:</b>
        <Code
          language="python"
          content={`start = max(0, i - self.window_size)\nend = min(seq_length, i + self.window_size + 1)`}
          lineNumber={17}
        />
        <p>
          Determines the start and end positions of the window centered around
          the current token.
        </p>
      </p>
      <p>
        <b>Extract query and window keys/values:</b>
        <Code
          language="python"
          content={`Q_i = Q[:, i:i+1, :]`}
          lineNumber={19}
        />
        <p>Extracts the query tensor for the current token.</p>
      </p>
      <p>
        <Code
          language="python"
          content={`K_window = K[:, start:end, :]\nV_window = V[:, start:end, :]`}
          lineNumber={20}
        />
        <p>
          Extracts the key and value tensors for the window around the current
          token.
        </p>
      </p>
      <p>
        <b>Compute attention scores:</b>
        <Code
          language="python"
          content={`scores = torch.matmul(Q_i, K_window.transpose(-2, -1)) / math.sqrt(x.size(-1))`}
          lineNumber={22}
        />
        <p>
          Computes the attention scores between the query and key tensors for
          the window.
        </p>
      </p>
      <p>
        <b>Apply softmax to obtain attention weights:</b>
        <Code
          language="python"
          content={`attention = torch.softmax(scores, dim=-1)`}
          lineNumber={23}
        />
        <p>
          Normalizes the attention scores using the softmax function along the
          last dimension.
        </p>
      </p>
      <p>
        <b>Combine values with attention weights:</b>
        <Code
          language="python"
          content={`outputs.append(torch.matmul(attention, V_window)`}
          lineNumber={24}
        />
        <p>
          Computes the weighted sum of values using the attention weights for
          the window.
        </p>
      </p>
      <p>
        <b>Concatenate attention outputs:</b>
        <Code
          language="python"
          content={`return torch.cat(outputs, dim=1)`}
          lineNumber={25}
        />
        <p>Joins the attention outputs for all tokens into a single tensor.</p>
      </p>
    </Expander>
    <p>
      Sliding Window Attention is a popular choice for handling long sequences
      in models like{" "}
      <a
        href="https://arxiv.org/pdf/2310.06825"
        target="_blank"
        rel="noreferrer"
      >
        Mistral 7B
      </a>
      {", "}
      <a
        href="https://arxiv.org/pdf/2004.05150"
        target="_blank"
        rel="noreferrer"
      >
        Longformer
      </a>
      .
    </p>
    <h2 id="flashAttention">7. Flash Attention</h2>
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <img
        width={"100%"}
        src={FlashAttention}
        alt="Flash Attention Attention"
      />
      <p style={{ fontSize: "0.8rem" }}>
        <i>Flash Attention</i>
      </p>
    </div>
    <p>
      Flash Attention is a performance-oriented reimplementation of vanilla
      attention. It leverages efficient memory layouts and GPU-friendly
      operations to calculate attention with minimal overhead. In short, it’s
      the speedster of the attention family—designed to give you all the power
      of vanilla attention but at lightning speed.
    </p>
    <p>
      Flash Attention (and it's versions 2 and 3) are mathematically the same as
      vanilla attention, but implemented efficiently to reduce memory and speed
      up computations on GPUs.
    </p>
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
      }}
      onClick={() =>
        window.open(
          "https://huggingface.co/docs/text-generation-inference/conceptual/flash_attention",
          "_blank",
          "noopener,noreferrer"
        )
      }
    >
      <img
        width={"100%"}
        src={FlashAttentionHuggingFace}
        alt="Flash Attention explained in HuggingFace Documentation"
      />
      <p style={{ fontSize: "0.8rem" }}>
        <i>Flash Attention Illustration in HuggingFace Documentation</i>
      </p>
    </div>
    <p>
      Standard attention mechanism uses High Bandwidth Memory (HBM) to store,
      read and write keys, queries and values. HBM is large in memory, but slow
      in processing, meanwhile SRAM is smaller in memory, but faster in
      operations.
    </p>
    <p>
      In the standard attention implementation, the cost of loading and writing
      keys, queries, and values from HBM is high. It loads keys, queries, and
      values from HBM to GPU on-chip SRAM, performs a single step of the
      attention mechanism, writes it back to HBM, and repeats this for every
      single attention step. Instead, Flash Attention loads keys, queries, and
      values once, fuses the operations of the attention mechanism, and writes
      them back.
    </p>
    <p>It uses vanilla attention, but with optimizations like:</p>
    <ol>
      <li>
        <b>Kernel Fusion:</b> It fuses multiple operations (matrix
        multiplications, softmax, and scaling) into a single optimized GPU
        kernel, reducing unnecessary memory access.
      </li>
      <li>
        <b>Tiling:</b> Flash Attention divides the attention matrices into
        smaller blocks (tiles) to optimize memory access and computation
        efficiency. This allows processing the input in smaller, manageable
        chunks, reducing the need to store the entire attention matrix in
        memory.
      </li>
      <li>
        <b>Recomputation:</b> Instead of storing intermediate results, Flash
        Attention recomputes them as needed, minimizing memory consumption.
      </li>
      <li>
        <b>Memory Efficiency:</b> By processing in blocks and recomputing, Flash
        Attention reduces memory usage from quadratic to linear with respect to
        sequence length, making it suitable for long sequences.
      </li>
      <li>
        <b>Numerical Stability:</b> Flash Attention employs techniques like the
        "max trick" to maintain numerical stability during the softmax
        computation, ensuring accurate results even with large inputs.
      </li>
      <li>
        <b>IO Complexity:</b> Flash Attention is designed to minimize the number
        of accesses to GPU high bandwidth memory (HBM), making it an efficient
        choice for various GPU sizes.
      </li>
    </ol>
    <p>
      I would like to include flash attention code over here. But then I
      realized that it is too long to include. So I will just include the link
      to the code.
      <br />
      <a
        href="https://github.com/Dao-AILab/flash-attention"
        target="_blank"
        rel="noreferrer"
      >
        Flash Attention Official Repository
      </a>
    </p>
    <p>
      Flash Attention being an efficient reimplementation of vanilla attention,
      it's widely used in models like{" "}
      <a
        href="https://arxiv.org/pdf/2310.06825"
        target="_blank"
        rel="noreferrer"
      >
        Mistral 7B
      </a>
      {", "}
      <a
        href="https://arxiv.org/pdf/2307.09288"
        target="_blank"
        rel="noreferrer"
      >
        LlaMA 2 - 70B
      </a>
      .
    </p>
    <p>
      HuggingFace's Transformers library also has an attribute to enable Flash
      Attention. If a model supports Flash Attention{" "}
      <code style={{ fontFamily: "monospace" }}>
        attn_implementation="flash_attention_2"
      </code>
      .
    </p>
    <h2 id="conclusion">Conclusion</h2>
    <p>
      Phew that was a bit too much, I know! But I hope you enjoyed the journey
      through the world of attention mechanisms. From vanilla attention to Flash
      Attention, we've covered a wide range of attention variants that power
      modern deep learning models.
    </p>
    <p>
      Attention mechanisms are the backbone of modern deep learning models,
      enabling them to capture complex relationships in data. By understanding
      the inner workings of attention, you can appreciate the nuances of
      different attention mechanisms and their impact on model performance.
    </p>
    <p>
      Whether you're building a new model or fine-tuning an existing one,
      choosing the right attention mechanism can significantly affect the
      efficiency and effectiveness of your model. Each attention variant has its
      strengths and weaknesses, making it crucial to select the one that best
      suits your use case.
    </p>
    <p>
      If you're interested in learning more about attention mechanisms and their
      applications, check out the following resources:
    </p>
    <ul>
      <li>
        Attention Is All You Need explained by Yannic Kilcher -{" "}
        <a href="https://youtu.be/iDulhoQ2pro?si=br0CvCfnb3HmhiFq">Video</a>
      </li>
      <li>
        The Illustrated Transformer by Jay Alammar -{" "}
        <a href="http://jalammar.github.io/illustrated-transformer/">Blog</a>
      </li>
      <li>
        Attention in transformers, step by step by 3Blue1Brown -{" "}
        <a href="https://youtu.be/eMlx5fFNoYc?si=w1Rz3hbqcfw7xgOR">Video</a>
      </li>
      <li>
        Variants of Multi-head attention: Multi-query (MQA) and Grouped-query
        attention (GQA) -{" "}
        <a href="https://youtu.be/pVP0bu8QA2w?si=1n1EnpmOcM7D2JL6">Video</a>
      </li>
      <li>
        Sliding Window Attention Explained -{" "}
        <a href="https://klu.ai/glossary/sliding-window-attention">Blog</a>
      </li>
      <li>
        Flash Attention explained by Umar Jamil -{" "}
        <a href="https://youtu.be/zy8ChVd_oTM?si=bx2mE7riK_CWJ_7L">Video</a>
      </li>
    </ul>
    <p>
      See you in the next blog! Until then, keep learning and exploring the
      fascinating world of deep learning.
    </p>
  </div>
);

const slug = title.replace(/\s+/g, "-").replaceAll(":", "").toLowerCase();
const image = cover;
const tags = [
  "Attention Mechanism",
  "Transformers",
  "Self-Attention",
  "SDPA",
  "Deep Learning",
  "Machine Learning",
  "Flash Attention",
  "Sliding Window Attention",
  "Infini-Attention",
  "Grouped Query Attention",
];

const date = "2025-03-24";
const readTime = 20;

const AttentionLayerbyLayerBlog = new BaseBlog(
  title,
  content,
  slug,
  image,
  tags,
  date,
  readTime
);

export default AttentionLayerbyLayerBlog;
