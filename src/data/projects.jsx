import DermaCare from "../assets/images/dermcare.png";
import Sonnet from "../assets/images/Sonnet Logo.jpg";
import LoomRag from "../assets/images/loomrag.jpeg";
import getTheme from "../utils/theme";

const fetchPinnedRepos = async (username) => {
  const token = import.meta.env.VITE_SOME_KEY;
  const query = `
      query($username: String!) {
        user(login: $username) {
          pinnedItems(first: 6, types: REPOSITORY) {
            nodes {
              ... on Repository {
                name
                description
                url
                languages(first: 6) {
                  nodes {
                    name
                    color
                  }
                }
                repositoryTopics(first: 5) {
                  nodes {
                    topic {
                      name
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;

  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query, variables: { username } }),
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.data.user.pinnedItems.nodes;
};

const projects = [
  {
    title: "QuillGPT",
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
          performing inference, resulting into <b>20-25% reduction</b> of the
          development time.
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
    description: (
      <ul>
        <li>
          Developed a <b>Multimodal Retrieval-Augmented Generation (RAG)</b>{" "}
          system integrating <b>OpenAI’s CLIP and Whisper</b> models for
          seamless{" "}
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
          Enabled <b>URL-based image indexing and website content scraping</b>{" "}
          for seamless integration and retrieval of web data.
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
          Created a comprehensive solution featuring both a web platform and a
          mobile application. Designed an intuitive user interface with{" "}
          <b>Figma</b>, implemented the web frontend using <b>ReactJS</b>, and
          built the mobile app with <b>Flutter</b>. The backend architecture was
          robustly developed using <b>Django REST Framework</b>.
        </li>
        <li>
          Trained a sophisticated computer vision model for skin disease
          detection utilizing <b>TensorFlow</b>, deployed via <b>FastAPI</b>,
          with image uploads managed through an <b>S3 bucket</b>.
        </li>
        <li>
          Enabled offline inference capabilities within the mobile application
          by integrating a <b>Tflite</b> model, ensuring accessibility in
          low-connectivity areas.
        </li>
        <li>
          Successfully executed the entire project within a{" "}
          <b>24-hour timeframe</b> during a hackathon, demonstrating rapid
          development and deployment skills.
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
          Orchestrated the complete architecture of <b>M2ConneX</b>, a
          comprehensive platform empowering MMCOE alumni to connect, network,
          and collaborate seamlessly.
        </li>
        <li>
          Designed and orchestrated the backend with the{" "}
          <b>Django REST framework</b>, fashioning an elegant frontend with{" "}
          <b>React JS</b> with <b>Tailwind CSS</b> and <b>Docker</b> for
          containerization, ensuring scalable and consistent deployment.
        </li>
        <li>
          Fortified the platform’s integrity with real-time checks, implementing{" "}
          <b>image classification</b> and a robust <b>profanity checker</b> with{" "}
          <b>95% accuracy</b> to swiftly <b>neutralize NSFW content</b> in just{" "}
          <b>6-7 seconds</b>.
        </li>
        <li>
          Engineered a sophisticated <b>recommendation system</b> using{" "}
          <b>Scikit-learn</b> to deliver personalized suggestions for
          connections, posts, and job opportunities, tailored to user skills and
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
          Developed a <b>chatbot</b> that suggests songs based on user input by
          leveraging <b>advanced language models</b> and <b>lyrics analysis</b>.
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
          Empowered college students and developers through an innovative social
          platform featuring <b>AI-powered recommendations</b> and{" "}
          <b>real-time messaging</b>.
        </li>
        <li>
          Spearheaded full-cycle mobile app development using <b>Figma</b> and{" "}
          <b>Flutter</b>, integrating advanced APIs and infinite scrolling for a
          buttery-smooth UX.
        </li>
        <li>
          Architected a powerful backend with <b>Django REST Framework</b>,
          paired with a polished <b>ReactJS</b> frontend for enterprise-grade
          scalability.
        </li>
        <li>
          Pioneered dynamic content loading and <b>RESTful API</b>{" "}
          optimizations, slashing latency by 65% during peak usage.
        </li>
      </ul>
    ),
    image:
      "https://avatars.githubusercontent.com/u/139642488?s=400&u=149eca032a1ffec7243a91b81f6756576695588c&v=4",
    tags: ["Flutter", "Django REST Framework", "ReactJS", "Tensorflow", "AWS"],
    domain: "Mobile",
    link: "https://github.com/Team-DevFinder",
  },
  {
    title: "Spam Filter using ALBERT",
    description: (
      <ul>
        <li>
          Developed an <b>email and text spam filter</b> utilizing "ALBERT" an{" "}
          <b>Encoder-Decoder model</b>.
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
    description: (
      <ul>
        <li>
          Developed a comprehensive <b>Neural Network Training library</b>{" "}
          similar to TensorFlow 2 from scratch in Python.
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
            onClick={(e) => {
              navigator.clipboard.writeText("pip install open-nn-python");
              alert("Copied to clipboard!");
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
