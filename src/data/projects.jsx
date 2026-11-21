import DermaCare from "../assets/images/dermcare.png";
import Sonnet from "../assets/images/Sonnet Logo.jpg";
import LoomRag from "../assets/images/loomrag.jpeg";
import TinyGPT from "../assets/images/TinyGPT.png";
import Tensorax from "../assets/images/blogs/TensoraxExplained/cover.png";

import getTheme from "../utils/theme";
import { fetchPinnedRepos } from "../api/fetchData";

/*
 * `featured: true` puts a project in the "Selected" list on /projects; the
 * rest go under "More projects". `summary` is the short version shown on the
 * homepage; the full `description` is shown on /projects.
 */
const projects = [
  {
    title: "Kiosk",
    featured: true,
    summary: (
      <>
        A live news search and recommendation app, self-hosted on a{" "}
        <b>Raspberry Pi 5</b>: 106 sources, 100K+ articles, hybrid BM25 + dense
        retrieval with a cross-encoder rerank. Moving BM25 into Qdrant cut the
        engine's memory <b>64%</b> so it fits the Pi, where the feed is served
        in <b>70 ms p50</b>.
      </>
    ),
    description: (
      <ul>
        <li>
          A <b>live news app</b> that ingests <b>106 sources every 15 minutes</b>{" "}
          (100K+ articles and growing). New articles show up in the app within a
          minute, with no restart.
        </li>
        <li>
          Search runs <b>hybrid BM25 + dense retrieval</b> in Qdrant, fused with
          RRF, adds query expansion only when results look weak, and reranks the
          top results with a <b>cross-encoder</b>. The home feed retrieves
          separately for each of the reader's interests, then ranks for
          relevance, freshness and <b>MMR diversity</b>.
        </li>
        <li>
          Detects <b>breaking news without any click data</b>: a story counts
          as breaking when many different outlets cover it in a short window.
          Groups articles into <b>stories that keep the same ID</b> across
          updates, so readers can follow them. <b>RAG chat</b> streams cited
          answers.
        </li>
        <li>
          Prototyped first, then rebuilt for production: FastAPI, PostgreSQL
          with Alembic migrations, Qdrant and Redis caching in Docker Compose,{" "}
          <b>self-hosted on a Raspberry Pi 5</b> behind Cloudflare. The
          frontend is an installable <b>PWA</b> that opens offline.
        </li>
        <li>
          <b>Performance:</b> the production rebuild cut search p95 by{" "}
          <b>46% (104 → 56 ms)</b> against the prototype on the same 90K-article
          corpus. Moving BM25 into Qdrant sparse vectors then cut the engine's
          memory by <b>64% (2.6 → 0.9 GB)</b> so it fits the Pi, trading some
          latency for RAM. (In-process measurements on a laptop.)
        </li>
        <li>
          <b>On the Raspberry Pi 5</b> (109K articles, measured over HTTP on
          the local network): the feed is served in <b>70 ms p50</b>, or{" "}
          <b>22 ms</b> from the Redis cache, and the engine uses{" "}
          <b>0.72 GB</b> of RAM.
        </li>
      </ul>
    ),
    tags: ["Qdrant", "FastAPI", "PostgreSQL", "Redis", "React", "Hybrid Search", "RAG", "Raspberry Pi"],
    domain: "ML",
    link: "https://kiosk.shrirangmahajan.in",
  },
  {
    title: "Tensorax",
    featured: true,
    summary: (
      <>
        A deep learning framework written from scratch in <b>C++/CUDA</b>, with
        autograd and a PyTorch-like API, and no NumPy, PyTorch or cuBLAS
        underneath. Its hand-written Tensor Core flash attention kernel (inline
        PTX) reaches <b>24.7 TFLOPS, 0.79× cuDNN</b>.
      </>
    ),
    description: (
      <ul>
        <li>
          Built a <strong>standalone tensor computation library</strong> from
          scratch with custom <strong>C++/CUDA kernels</strong> and Python
          bindings, without relying on NumPy, PyTorch, or cuBLAS.
        </li>
        <li>
          Implemented complete{" "}
          <strong>automatic differentiation (autograd)</strong> with
          computational graph and <strong>PyTorch-like API</strong> including
          neural network layers, optimizers, and loss functions.
        </li>
        <li>
          Hand-wrote a <strong>Tensor Core flash attention kernel</strong> in
          inline PTX (mma.sync, ldmatrix, cp.async) that reaches{" "}
          <strong>24.7 TFLOPS, 0.79× cuDNN</strong> at long sequences, without
          calling any external math library.
        </li>
        <li>
          Published on{" "}
          <a href="https://pypi.org/project/tensorax/" target="_blank">
            PyPI
          </a>{" "}
          with a complete neural network training pipeline including SGD, Adam
          optimizers, and multiple activation functions.
        </li>
        <li>
          Available on{" "}
          <a href="https://github.com/NotShrirang/tensorax" target="_blank">
            GitHub
          </a>{" "}
          with comprehensive documentation and examples.
        </li>
      </ul>
    ),
    image: Tensorax,
    tags: [
      "C++",
      "CUDA",
      "Python",
      "PyBind11",
      "GPU Computing",
      "Deep Learning",
    ],
    domain: "ML",
    link: "https://github.com/NotShrirang/tensorax",
  },
  {
    title: "TinyGPT",
    featured: true,
    summary: (
      <>
        A <b>95M-parameter GPT</b> (RoPE, GQA, RMSNorm) pretrained from scratch
        on one <b>8 GB RTX 3070 Ti</b>, using mixed precision, gradient
        accumulation and fused kernels to fit. Instruction-tuned on Alpaca and
        served <b>in your browser</b> through ONNX and WebGPU.
      </>
    ),
    description: (
      <ul>
        <li>
          Pretrained <strong>TinyGPT</strong>, a <strong>95M-parameter</strong>{" "}
          GPT (RoPE, GQA, RMSNorm), from scratch in PyTorch on{" "}
          <strong>2.1B tokens</strong> of OpenWebText on one{" "}
          <strong>RTX 3070 Ti (8GB VRAM)</strong>, using mixed precision,
          gradient accumulation and <strong>Liger fused kernels</strong>.
        </li>
        <li>
          Instruction-tuned it on <b>Stanford Alpaca</b> (
          <b>val perplexity 7.3</b>), exported it to ONNX, and run it{" "}
          <b>in the browser via WebGPU</b> on this site.
        </li>
        <li>
          Deployed an interactive <strong>Streamlit</strong> UI on a free-tier
          CPU with <b>dynamic model switching</b>. Published the model on{" "}
          <a href="https://huggingface.co/NotShrirang" target="_blank">
            HuggingFace
          </a>{" "}
          and shared on{" "}
          <a href="https://github.com/NotShrirang/tinygpt" target="_blank">
            GitHub
          </a>{" "}
          and{" "}
          <a href="https://tinygpt.streamlit.app/" target="_blank">
            Streamlit Cloud
          </a>
          .
        </li>
      </ul>
    ),
    image: TinyGPT,
    tags: ["PyTorch", "Streamlit", "HuggingFace", "Mixed-Precision Training"],
    domain: "ML",
    link: "https://github.com/NotShrirang/tinygpt",
  },
  {
    title: "LLM Serving Engine",
    featured: true,
    summary: (
      <>
        An LLM inference server built from scratch, one technique at a time:
        KV cache, batching, then a <b>continuous-batching engine</b> with
        admission control. Benchmarked against vLLM (<b>788 vs 9,370 tok/s</b>),
        with the 12× gap traced to PagedAttention, fused kernels and CUDA
        graphs.
      </>
    ),
    description: (
      <ul>
        <li>
          Built an LLM inference server from scratch in steps, benchmarking
          each one: a KV cache, static batching, then a{" "}
          <b>continuous-batching engine</b> that merges live requests into a
          rolling batch, with <b>admission control</b> that sheds load as HTTP
          429 past capacity. Serves Qwen2.5-0.5B over FastAPI on one 8 GB GPU.
        </li>
        <li>
          Replaced recompute-on-rebatch with <b>KV cache surgery</b> (prefill
          only new requests and splice their KV in; slice finished rows out),
          and found an autograd memory leak in the serving path. Together these
          took peak throughput from <b>389 to 788 tok/s</b> with zero errors up
          to 64 concurrent requests.
        </li>
        <li>
          Benchmarked against <b>vLLM</b> on the same GPU, model and prompts:{" "}
          <b>788 vs 9,370 tok/s</b> at peak, 2.4× slower per token, 13× slower
          to first token. Traced each part of the gap to a specific technique:{" "}
          <b>PagedAttention</b> for capacity, <b>fused kernels and CUDA
          graphs</b> for per-token latency, a faster prefill for TTFT.
        </li>
      </ul>
    ),
    tags: ["PyTorch", "FastAPI", "vLLM", "Continuous Batching", "LLM Inference"],
    domain: "ML",
    link: "https://github.com/NotShrirang/Learning-Inference-Optimization",
  },
  {
    title: "AgentFlow",
    description: (
      <ul>
        <li>
          Engineered a <b>multi-agent orchestration platform</b> using{" "}
          <b>LangGraph</b> to handle intent classification, planning, and{" "}
          automated tool execution.
        </li>
        <li>
          Built a <b>workflow engine</b> with custom scheduling (cron and
          interval) and <b>JWT authentication</b>, deployed with{" "}
          <b>Docker</b>.
        </li>
      </ul>
    ),
    image:
      "https://raw.githubusercontent.com/NotShrirang/NotShrirang/main/agentflow.png",
    tags: ["LangGraph", "FastAPI", "React", "Docker", "Multi-Agent Systems"],
    domain: "ML",
    link: "",
  },
  {
    title: "Split.ai",
    description: (
      <ul>
        <li>
          Architected a <b>fault-tolerant receipt parsing engine</b> with a{" "}
          <b>multi-LLM fallback strategy</b> (Gemini → Llama 3), so a failed
          parse retries on a second model rather than dropping the receipt.
        </li>
        <li>
          Implemented a <b>graph-based debt simplification algorithm</b> to{" "}
          minimize transaction volume and utilized <b>Celery/RabbitMQ</b> for
          asynchronous OCR processing.
        </li>
      </ul>
    ),
    image:
      "https://raw.githubusercontent.com/NotShrirang/NotShrirang/main/splitai.png",
    tags: ["Django", "Celery", "RabbitMQ", "Gemini", "Llama", "LLM"],
    domain: "ML",
    link: "https://github.com/NotShrirang/Split.ai",
  },
  {
    title: "QuillGPT",
    featured: true,
    description: (
      <ul>
        <li>
          Implemented a <b>GPT decoder block</b> with <b>Self-Attention</b> and{" "}
          <b>Multi-Headed Attention</b> using <b>PyTorch</b>.{" "}
        </li>
        <li>
          Developed and pre-trained two distinct models: Shakespearean GPT and
          Harpoon GPT. Deployed a <b>Streamlit Playground</b> for interactive
          model exploration.
        </li>
        <li>
          Leveraged <b>FastAPI microservice</b> for rapid development with{" "}
          <b>Docker containerization</b> for portability.
        </li>
        <li>
          Created <b>Python scripts</b> for training new GPT models and
          performing inference, so a new model can be trained and served
          without rewriting the pipeline each time.
        </li>
        <li>
          Designed and implemented a <b>simple tokenizer</b> for efficient text
          encoding and decoding. Wrote{" "}
          <b>custom serialization and de-serialization methods</b> for
          portability.
        </li>
      </ul>
    ),
    image:
      "https://github.com/NotShrirang/QuillGPT/assets/85283622/2e63d8ce-24f8-4bf0-835a-0c621f1d7400",
    tags: ["PyTorch", "FastAPI", "Streamlit", "Docker"],
    domain: "ML",
    link: "https://github.com/NotShrirang/QuillGPT",
  },
  {
    title: "LoomRAG: A Multimodal RAG",
    featured: true,
    description: (
      <ul>
        <li>
          Developed a <b>Multimodal Retrieval-Augmented Generation (RAG)</b>{" "}
          system using <b>OpenAI’s CLIP and Whisper</b> for{" "}
          <b>
            cross-modal retrieval and semantic search across text, images, and
            audio
          </b>
          , responding within <b>2-3 seconds</b>.
        </li>
        <li>
          Deployed a <b>Streamlit-based interface</b> for searching, annotating
          and creating custom datasets and <b>fine-tuning the CLIP model</b>{" "}
          with configurable parameters for domain-specific applications.
        </li>
        <li>
          Implemented <b>multimodal input support</b>, allowing users to upload
          images, PDFs, and audio files or use real-time audio recording for
          enhanced interaction.
        </li>
        <li>
          Added <b>URL-based image indexing and website scraping</b>, so web
          content can be indexed and searched too.
        </li>
        <li>
          Utilized <b>FAISS</b> for efficient similarity search by aligning
          embeddings in a shared latent space.
        </li>
      </ul>
    ),
    image: LoomRag,
    tags: ["PyTorch", "OpenAI CLIP", "OpenAI Whisper", "Streamlit", "FAISS"],
    domain: "ML",
    link: "https://github.com/NotShrirang/LoomRAG",
  },
  {
    title: "ParkVision",
    description: (
      <ul>
        <li>
          Developed an AI-driven parking analytics and customer segmentation
          dashboard utilizing the <b>MVC</b> architecture.
        </li>
        <li>
          Fine-tuned <b>YOLOv8</b> with <b>0.968 mAP</b> and <b>EasyOCR</b> with{" "}
          <b>85% accuracy</b> for vehicle plate recognition, integrating the{" "}
          <b>IDFY API</b> for extracting vehicle details.
        </li>
        <li>
          Designed and created <b>REST APIs</b> using{" "}
          <b>Django REST Framework</b> and <b>FastAPI</b>.
        </li>
        <li>
          Designed and implemented <b>Progressive Web App</b> with downloadable
          capabilities, including frontend API caching.
        </li>
        <li>
          Leveraged <b>PostgreSQL</b> for data storage, <b>Celery</b> for
          background tasks, <b>Redis</b> for caching, and <b>Docker</b> for
          containerization.
        </li>
      </ul>
    ),
    image:
      "https://github.com/Parkomate-ParkVision/parkvision-frontend/assets/85283622/6f609ea7-b547-43cb-a771-2240ec86e914",
    tags: [
      "PyTorch",
      "Django REST framework",
      "FastAPI",
      "ReactJS",
      "Tailwind CSS",
      "Celery",
      "Docker",
      "PostgreSQL",
    ],
    domain: "Web",
    link: "https://github.com/orgs/Parkomate-ParkVision/repositories",
  },
  {
    title: "DermaCare.ai",
    description: (
      <ul>
        <li>
          Developed an <b>AI-driven portal</b> for early detection of skin
          diseases, targeting patients in rural areas and facilitating
          consultations with the nearest dermatologists.
        </li>
        <li>
          Built both a web platform and a mobile app: UI in <b>Figma</b>, web
          frontend in <b>ReactJS</b>, mobile app in <b>Flutter</b>, and a{" "}
          <b>Django REST Framework</b> backend.
        </li>
        <li>
          Trained a skin-disease classifier in <b>TensorFlow</b>, served it with{" "}
          <b>FastAPI</b>, and stored image uploads in <b>S3</b>.
        </li>
        <li>
          Shipped a <b>TFLite</b> version inside the mobile app so it works
          offline in low-connectivity areas.
        </li>
        <li>
          Built the whole project in <b>24 hours</b> at a hackathon.
        </li>
      </ul>
    ),
    image: DermaCare,
    tags: [
      "Flutter",
      "TensorFlow",
      "Django REST Framework",
      "FastAPI",
      "ReactJS",
      "Docker",
      "PostgreSQL",
    ],
    domain: "Web",
    link: "",
  },
  {
    title: "M2ConneX",
    description: (
      <ul>
        <li>
          Designed and built <b>M2ConneX</b>, a platform for MMCOE alumni to
          connect and network.
        </li>
        <li>
          Built the backend with <b>Django REST Framework</b> and the frontend
          with <b>React</b> and <b>Tailwind CSS</b>, containerized with{" "}
          <b>Docker</b>.
        </li>
        <li>
          Added content moderation: an <b>image classifier</b> for NSFW images
          and a <b>profanity checker</b> (<b>95% accuracy</b>), flagging posts
          within <b>6-7 seconds</b>.
        </li>
        <li>
          Built a <b>recommendation system</b> with <b>Scikit-learn</b> that
          suggests connections, posts and jobs based on a user's skills and
          experience.
        </li>
        <li>
          Used <b>PostgreSQL</b> for data storage, <b>Celery</b> for background
          tasks, and <b>Docker</b> for containerization.
        </li>
      </ul>
    ),
    image:
      "https://raw.githubusercontent.com/NotShrirang/M2ConneX-frontend/main/src/assets/M2Connex.svg",
    tags: [
      "Django REST Framework",
      "ReactJS",
      "Tailwind CSS",
      "Scikit Learn",
      "Docker",
      "PostgreSQL",
    ],
    domain: "Web",
    link: "https://github.com/NotShrirang/M2ConneX",
  },
  {
    title: "Sonnet",
    description: (
      <ul>
        <li>
          Developed a <b>chatbot</b> that suggests songs from a user's message
          by searching song <b>lyrics</b> with an LLM.
        </li>
        <li>
          Implemented <b>LangChain</b> for efficient natural language processing
          and <b>FAISS Vectorstore</b> for fast, accurate similarity search in
          song lyrics, delivering rapid responses in <b>2-3 seconds</b>.
        </li>
        <li>
          Integrated a database of songs and lyrics to enhance the
          recommendation engine's accuracy and diversity.
        </li>
        <li>
          Created and optimized <b>Python scripts</b> for processing text inputs
          and querying the song database.
        </li>
      </ul>
    ),
    image: Sonnet,
    tags: ["LangChain", "FAISS Vectorstore", "Python"],
    domain: "ML",
    link: "https://github.com/NotShrirang/Sonnet",
  },
  {
    title: "DevFinder",
    description: (
      <ul>
        <li>
          A social platform for college students and developers, with{" "}
          <b>recommendations</b> and <b>real-time messaging</b>.
        </li>
        <li>
          Built the mobile app in <b>Flutter</b> (designed in <b>Figma</b>),
          with infinite scrolling.
        </li>
        <li>
          Built the backend with <b>Django REST Framework</b> and a{" "}
          <b>ReactJS</b> web frontend.
        </li>
        <li>
          Added lazy content loading and API optimizations that cut latency by
          65% at peak usage.
        </li>
      </ul>
    ),
    image:
      "https://avatars.githubusercontent.com/u/139642488?s=400&u=149eca032a1ffec7243a91b81f6756576695588c&v=4",
    tags: ["Flutter", "Django REST Framework", "ReactJS", "Tensorflow", "AWS"],
    domain: "App Dev",
    link: "https://github.com/Team-DevFinder",
  },
  {
    title: "Spam Filter using ALBERT",
    description: (
      <ul>
        <li>
          Developed an <b>email and text spam filter</b> using{" "}
          <b>ALBERT</b>, an encoder-only transformer.
        </li>
        <li>
          Fine-tuned the ALBERT model on a spam detection dataset and deployed
          it on <b>Hugging Face</b>.
        </li>
        <li>
          Built and hosted a frontend interface using <b>Streamlit</b> for user
          interaction.
        </li>
      </ul>
    ),
    image: "",
    tags: ["PyTorch", "HuggingFace Transformers", "Streamlit"],
    domain: "ML",
    link: "https://github.com/NotShrirang/Spam-Filter-using-ALBERT",
  },
  {
    title: "OpenNN",
    featured: true,
    description: (
      <ul>
        <li>
          Developed a <b>neural network training library</b> in the style of
          TensorFlow 2, from scratch in Python and NumPy. It came before
          Tensorax.
        </li>
        <li>
          Implemented core neural network components including{" "}
          <b>layers, activations, loss functions, and optimization</b>{" "}
          algorithms.
        </li>
        <li>
          Install via PyPI:
          <br />
          <pre
            style={{
              padding: "0.5rem",
              backgroundColor:
                getTheme() === "light" ? "#E2E2E2" : "rgb(50, 50, 50)",
              cursor: "pointer",
              borderRadius: "0.5rem",
            }}
            title="Click to copy"
            onClick={() => {
              navigator.clipboard?.writeText("pip install open-nn-python");
            }}
          >
            pip install open-nn-python
          </pre>
        </li>
        <li>
          Created detailed documentation and example notebooks to demonstrate
          the usage and capabilities of the library.
        </li>
      </ul>
    ),
    image: "",
    tags: ["NumPy"],
    domain: "ML",
    link: "https://github.com/NotShrirang/OpenNN",
  },
];

export { fetchPinnedRepos, projects };
