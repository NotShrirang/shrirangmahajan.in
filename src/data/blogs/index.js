// Blog metadata index — used by Home + Writing list.
// Each entry's `content` JSX (the heavy part) is loaded on-demand by Post.jsx
// via `loadBlogContent(slug)`. This keeps the initial bundle free of
// ~5,000 lines of blog content + all inline blog images.

import VectorEmbeddingsCover from "../../assets/images/blogs/VectorEmbeddings/cover.png";
import AttentionCover from "../../assets/images/blogs/Attention/cover.png";
import AttentionLayerByLayerCover from "../../assets/images/blogs/AttentionLayerByLayer/cover.png";
import Llama4Cover from "../../assets/images/blogs/Llama4NativelyMultimodalAI/cover.png";
import Llama2Cover from "../../assets/images/blogs/Llama2Explained/cover.png";
import TensoraxCover from "../../assets/images/blogs/TensoraxExplained/cover.png";
import TinyGPTCover from "../../assets/images/blogs/TinyGPT/cover.png";

const blogs = [
  {
    title: "From Words to Meaning: The Journey From Word Vectors to Learnable Embeddings",
    slug: "from-words-to-meaning:-the-journey-from-word-vectors-to-learnable-embeddings",
    description:
      "Why one-hot encoding falls short, how Word2Vec-style vectors capture meaning, and how learnable input embeddings feed a transformer's context window.",
    image: VectorEmbeddingsCover,
    tags: ["Machine Learning", "Deep Learning", "Data Science", "LLMs", "Word Embeddings", "Vector Embeddings"],
    date: "2025-03-13",
    readTime: 4,
    load: () => import("./VectorEmbeddings.jsx"),
  },
  {
    title: "Attention: Explanation is All You Need",
    slug: "attention-explanation-is-all-you-need",
    description:
      "A plain-English introduction to the attention mechanism: what it actually computes, why transformers were built around it, and why it changed NLP.",
    image: AttentionCover,
    tags: ["Attention Mechanism", "Transformers", "Self-Attention", "Machine Learning", "Deep Learning", "LLMs"],
    date: "2025-03-20",
    readTime: 6,
    load: () => import("./AttentionExplanationIsAllYouNeed.jsx"),
  },
  {
    title: "Attention and the versions of it: Layer by Layer",
    slug: "attention-and-the-versions-of-it-layer-by-layer",
    description:
      "Seven attention variants layer by layer: self, bidirectional, multi-query, grouped-query, Infini-Attention, sliding window and Flash Attention.",
    image: AttentionLayerByLayerCover,
    tags: [
      "Attention Mechanism", "Transformers", "Self-Attention", "SDPA",
      "Deep Learning", "Machine Learning", "Flash Attention",
      "Sliding Window Attention", "Infini-Attention", "Grouped Query Attention",
    ],
    date: "2025-03-24",
    readTime: 20,
    load: () => import("./AttentionLayerByLayer.jsx"),
  },
  {
    title: "Llama 4: The Natively Multimodal AI",
    slug: "llama-4-the-natively-multimodal-ai",
    description:
      "Inside Llama 4: its mixture-of-experts architecture, training data, pre- and post-training recipe, and what native multimodality changes in practice.",
    image: Llama4Cover,
    tags: [
      "Llama", "Meta AI", "Llama4", "LLM", "Multimodal AI",
      "Mixture of Experts (MoE)", "Attention", "Generative AI",
      "Machine Learning", "Deep Learning",
    ],
    date: "2025-04-05",
    readTime: 5,
    load: () => import("./Llama4NativelyMultimodalAI.jsx"),
  },
  {
    title: "Llama 2 Explained",
    slug: "llama-2-explained",
    description:
      "Llama 2's architecture end to end — RMSNorm, rotary embeddings, grouped-query attention, the KV cache and SwiGLU — and what changed since Llama 1.",
    image: Llama2Cover,
    tags: [
      "Llama", "Meta AI", "Llama2", "LLM", "Transformer",
      "Grouped-Query Attention", "KV Cache", "Attention",
      "Machine Learning", "Deep Learning",
    ],
    date: "2025-04-12",
    readTime: 8,
    load: () => import("./Llama2Explained/Llama2Explained.jsx"),
  },
  {
    title: "Writing CUDA Kernels from Scratch: A Beginner's Guide",
    slug: "writing-cuda-kernels-from-scratch-a-beginner's-guide",
    description:
      "CUDA from first principles: threads, blocks and grids, a vector-add warm-up, then optimising matrix multiplication with tiling and shared memory.",
    image: TensoraxCover,
    tags: [
      "CUDA", "GPU Programming", "Matrix Multiplication", "Deep Learning",
      "Performance Optimization", "C++", "High Performance Computing",
    ],
    date: "2026-01-11",
    readTime: 10,
    load: () => import("./TensoraxExplained/TensoraxExplained.jsx"),
  },
  {
    title: "Pre-training a 95M Parameter LLM on a Consumer GPU",
    slug: "pretraining-95m-llm-consumer-gpu",
    description:
      "Pre-training a 95M-parameter LLM on one 8GB RTX 3070 Ti: the architecture, mixed precision and gradient accumulation, the training run, and SFT.",
    image: TinyGPTCover,
    tags: [
      "LLM", "PyTorch", "Pre-training", "Mixed Precision", "Transformer",
      "Deep Learning", "GPU", "Machine Learning",
    ],
    date: "2026-03-08",
    readTime: 15,
    load: () => import("./TinyGPTPretraining/TinyGPTPretraining.jsx"),
  },
];

blogs.sort((a, b) => new Date(b.date) - new Date(a.date));

export default blogs;

// Resolve full blog content for a given slug. Returns a promise that resolves
// to { title, slug, image, tags, date, readTime, content }.
export async function loadBlogContent(slug) {
  const entry = blogs.find((b) => b.slug === slug);
  if (!entry) return null;
  const mod = await entry.load();
  return mod.default;
}
