import Code from "../../utils/codeUtils";
import TenorEmbed from "../../utils/TenorEmbed.jsx";
import BaseBlog from "./BaseBlog";
import cover from "../../assets/images/blogs/VectorEmbeddings/cover.png";

const title =
  "From Words to Meaning: The Journey from Word Vectors to Learnable Embeddings";

const content = (
  <div style={{ textAlign: "justify", width: "100%" }}>
    <p>
      Imagine you’re talking to <b>Jarvis from Iron Man</b> or{" "}
      <b>C-3PO from Star Wars</b>, these AI systems understand language almost
      like humans do. But how does that actually work? How does a machine
      "understand" the difference between a king and a queen, or that Paris and
      France are related?
    </p>
    <TenorEmbed postId={"3737205868965929533"} />
    <h2>Let's set the stage!</h2>
    <p>
      Early on, computers treated words like unique symbols, kind of like
      Pokémon with their own unique ID numbers. But that approach didn’t capture
      any real-world meaning. Enter Word Vectors, inspired by Word2Vec, which
      changed everything. Now, words could be represented as points in a
      multi-dimensional space, where relationships and analogies became
      mathematically possible.
    </p>
    <p>
      But we’re just getting started. These word vectors weren’t just fixed
      lookups, they evolved into learnable embeddings, forming the foundation of
      modern NLP models like ChatGPT and Google Translate. So, how do we get
      from simple words to embeddings that power AI?
    </p>
    <p>
      But before we get to these powerful word vectors, let’s take a step back.
      How did computers originally represent words?
    </p>
    <h2>One-Hot Encoding: The Old Way</h2>
    <p>
      The first, most basic approach was One-Hot Encoding. This method is so
      simple it feels almost primitive now. Each word was assigned a unique ID
      and represented as a long vector filled with zeros, except for a single 1
      in the position assigned to that word.
    </p>
    <Code
      language="python"
      content={`"Hello" -> [1, 0, 0, …, 0]\n"World" -> [0, 1, 0, …, 0]`}
    />
    <p>
      Sounds straightforward, right? But here’s the catch! Does this
      representation tell us that <b>“king”</b> and <b>“queen”</b> are related?
      Or that <b>“dog”</b>, <b>"dogg"</b> and <b>“dawg”</b> share similarities?
      :)
    </p>
    <TenorEmbed postId={"17247918"} />
    <p>
      Well, by this method, to a machine, every word is just as different from
      the next as “pizza” is from “quantum physics.” Not ideal!
    </p>
    <h2>Enter Word Vectors (Inspired by Word2Vec)</h2>
    <h3>A More Meaningful Representation</h3>
    <img
      width={"100%"}
      src="https://cdn.sanity.io/images/bbnkhnhl/production/9d9a653b2bb115c9ecae49532d8bbcd97e3e45ed-1920x1080.jpg?w=3840&q=75&fit=clip&auto=format"
      alt="Vector Embeddings Visualized in 2D"
      onClick={() => {
        window.open(
          "https://cdn.sanity.io/images/bbnkhnhl/production/9d9a653b2bb115c9ecae49532d8bbcd97e3e45ed-1920x1080.jpg?w=3840&q=75&fit=clip&auto=format",
          "_blank"
        );
      }}
    />
    <p>
      Instead of using a massive, mostly empty vector, word embeddings pack rich
      information into a dense, continuous vector space. For example, you might
      see something like:
    </p>
    <Code
      language="python"
      content={`"Hello" -> [0.2, 0.8, 0.1, …, 0.5]\n"World" -> [0.1, 0.7, 0.3, …, 0.6]`}
    />
    <p>
      In these vectors, numbers represent learned features that capture semantic
      relationships. Words with similar meanings or contexts end up near each
      other, think of them as neighbors in a high-dimensional city.
    </p>
    <h3>The Famous King–Queen Relationship</h3>
    <p>A classic example often cited is:</p>
    <Code language="cpp" content={`v(King) – v(Man) + v(Woman) ≈ v(Queen)`} />
    <img
      style={{ backgroundColor: "white" }}
      width={"100%"}
      src="https://www.askyourdata.co/uploads/9/7/6/7/97671206/linear-relationships_orig.png"
      alt="Vector Embeddings Visualized in 2D"
      onClick={() => {
        window.open(
          "https://www.askyourdata.co/uploads/9/7/6/7/97671206/linear-relationships_orig.png",
          "_blank"
        );
      }}
    />
    <p>
      It’s a neat demonstration that these vectors can capture gender
      relationships and other analogies in a purely mathematical way.
    </p>
    <h2>Why Does This Matter?</h2>
    <ol>
      <li>
        <strong>Similarity Searches:</strong> You can quickly find semantically
        similar words by calculating distances or similarities in the vector
        space (e.g., cosine similarity).
      </li>
      <li>
        <strong>Better NLP Tasks:</strong> Tasks like sentiment analysis,
        machine translation, and question answering become more accurate because
        the machine “understands” context, not just raw tokens.
      </li>
    </ol>
    <p>
      We've seen how word vectors allow us to capture relationships between
      words in a meaningful way, mapping concepts like King - Man + Woman =
      Queen using vector arithmetic. This structured representation is what
      makes modern NLP models powerful.
    </p>
    <p>
      But how do these word vectors actually get used inside a deep learning
      model? Are they fixed like a dictionary lookup, or do they evolve as the
      model learns?
    </p>
    <p>This brings us to input embeddings.</p>
    <h2>Input Embeddings: The Building Blocks</h2>
    <p>
      The first step in transforming raw text into something a neural network
      can understand. Unlike one-hot encodings, which are static, embeddings are
      learnable parameters, meaning they get updated during training to better
      capture contextual meanings.
    </p>
    <h3>From Tokens to IDs to Vectors</h3>
    <p>
      Modern NLP pipelines typically convert words to tokens (IDs), and then
      these IDs are turned into embeddings:
    </p>
    <Code language="python" content={`word -> id -> embedding`} />
    <p>
      These <b>embeddings are “learnable” parameters</b>, which means they
      adjust during training to best represent each token’s meaning in the
      context of your specific task.
    </p>
    <h3>Embedding Dimensions</h3>
    <p>
      Embeddings can vary in size, commonly 256, 384, 512, or even few thousands
      of dimensions. The idea is that more dimensions let the model capture more
      nuances, but going too large can lead to overfitting or heavy
      computational costs.
    </p>
    <h2>Fitting everything into the context window:</h2>
    <ul>
      <li>
        One-Hot Encoding: Great for the “Hello World” of yesteryear, but limited
        in capturing meaning.{" "}
      </li>{" "}
      <li>
        Word Embeddings: A leap forward, enabling rich, contextual understanding
        of words.{" "}
      </li>{" "}
      <li>
        Input Embeddings: The learnable parameters that feed into models like
        RNNs, bridging raw text and machine-friendly vectors.
      </li>
    </ul>
    <h2>Wrapping It Up: From Words to Meanings</h2>
    <p>
      We started with one-hot encoding, a method so rigid that it treated every
      word like a unique Pokémon with no evolutionary connections. Then, Word
      Vectors stepped in, giving words meaning through relationships, turning
      simple text into a structured, math-powered language map.
    </p>
    <p>
      But the real magic? Learnable embeddings. Unlike static word vectors,
      modern embeddings evolve as a model trains, adapting to new contexts and
      capturing deep nuances of language. This is what fuels today’s AI, whether
      it’s ChatGPT predicting your next word, Google Search understanding your
      intent, or Midjourney interpreting a text prompt for art.
    </p>
    <p>
      So, what’s next? If embeddings are this powerful, what happens when we
      apply them beyond words, to images, videos, and even multimodal AI? The
      future of deep learning isn’t just about text, it’s about bridging all
      forms of data into one unified understanding.
    </p>
    <p>And that’s where things get really interesting!</p>
    <TenorEmbed postId={"12668381"} />
  </div>
);

const slug = title.replace(/\s+/g, "-").toLowerCase();
const image = cover;
const tags = [
  "Machine Learning",
  "Deep Learning",
  "Data Science",
  "LLMs",
  "Word Embeddings",
  "Vector Embeddings",
];

const date = "March 13th, 2025";
const readTime = 4;

const VectorEmbeddingsBlog = new BaseBlog(
  title,
  content,
  slug,
  image,
  tags,
  date,
  readTime
);

export default VectorEmbeddingsBlog;
