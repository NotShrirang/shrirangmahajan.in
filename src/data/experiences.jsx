const fetchExperience = () => [
  {
    id: 1,
    title: "Machine Learning Engineer - II",
    company: "Skylark Labs",
    description: [
      <>
        <b>Aircraft tracker:</b> designed and built from scratch, as the sole
        engineer, an AI-based real-time PTZ camera tracking system that follows
        every airfield takeoff and landing at the tightest optical zoom. It
        combines YOLO object detection, an EfficientNet aircraft-type
        classifier, a calibrated camera model, visual odometry with SIFT/RANSAC
        pose correction against a reference bank, and predictive motion control
        that aims ahead of the camera's 1–2 s command lag. It runs at{" "}
        <b>22 FPS</b> with <b>22 ms</b> TensorRT detection, and has tracked{" "}
        <b>1,400+ live operations</b> with the aircraft <b>in frame 90%</b> of
        the time, following <b>86%</b> of them to the runway end.
      </>,
      <>
        <b>FrameSeek:</b> prototyped a CCTV search tool where any LLM (Claude,
        GPT, Gemini, Groq) answers plain-language questions about video
        through <b>19 MCP tools</b>, such as search by description or photo,
        re-identification, PPE and weapons. Video is indexed once with YOLO26,
        ByteTrack, SigLIP2 and DINOv2 at <b>near real time on an 8 GB GPU</b>,
        and every answer comes with evidence and a timestamped clip.
      </>,
      <>
        Cut retrieval latency <b>88% (971 → 113 ms)</b> by searching
        embeddings only around detected objects in a Qdrant (HNSW) vector store
        instead of the full frame, and caching features to skip <b>87%</b> of
        repeat model calls.
      </>,
      <>
        <b>Model serving:</b> doubled inference throughput{" "}
        <b>(3 → 7 FPS)</b> by serving TensorRT models on NVIDIA Triton
        Inference Server over gRPC, reaching <b>120+ inferences/s</b> at{" "}
        <b>under 50 ms P95</b>.
      </>,
      <>
        <b>Drishti:</b> built a distributed annotation platform with GPU
        pre-labelling on Celery workers, automated QC and real-time batching
        (Django, React, PostgreSQL, Docker, Cloudflare R2) that{" "}
        <b>tripled annotation throughput</b>.
      </>,
    ],
    duration: "November 2025 - Present",
    link: "https://skylarklabs.ai/",
  },
  {
    id: 2,
    title: "Data Scientist",
    company: "Emergys",
    description: [
      <>
        Designed and implemented, as an <b>individual contributor</b>, a
        comprehensive dashboard for detecting <b>price outliers</b> in product
        flavor data, incorporating <b>clustering analysis</b>,{" "}
        <b>supplier concentration metrics</b>, and{" "}
        <b>portfolio optimization techniques</b>.
      </>,
      <>
        Built a <b>promo-sales forecasting engine</b> using{" "}
        <b>Gradient Boosting</b> (R2: 0.93) on <b>Azure Databricks</b>;
        automated optimization using <b>TPE-based recommender</b> to suggest an
        optimal promotional strategy.
      </>,
      <>
        Led the development of <b>SQL AI Agent</b> for BI dashboards using{" "}
        <b>fine-tuned LLMs</b>, <b>React/Tailwind frontend</b>, and{" "}
        <b>Django/Docker backend</b>, delivering <b>sub-5s queries</b> and
        deployed across multiple enterprise clients, evolving into a{" "}
        <b>core revenue-generating product</b> and reducing query turnaround
        time by <b>90%</b>.
      </>,
    ],
    duration: "July 2024 - October 2025",
    link: "https://www.emergys.com/",
  },
  {
    id: 4,
    title: "SDE Intern",
    company: "Atomic Loops",
    description: [
      <>
        Engineered backend REST APIs using <b>Django REST Framework</b> for
        diverse products, facilitating data generation and collection for
        training ML models. Designed and implemented app for Yoga pose detection
        using Flutter.
      </>,
      <>
        Implemented a <b>Real-time Chat API</b> using <b>WebRTC</b> for a
        client's website.
      </>,
      <>
        Designed and implemented app for Yoga pose detection using{" "}
        <b>Flutter</b>.
      </>,
    ],
    duration: "April 2023 - December 2023",
    link: "https://atomicloops.com/",
  },
  {
    id: 5,
    title: "ML Intern",
    company: "Nishikawa Communications Pvt. Ltd.",
    description: [
      <>
        Developed an <b>image straightener tool</b> using <b>OpenCV</b> and{" "}
        <b>TesseractOCR</b>. This system automatically corrects titled or
        flipped images, delivering results in a rapid response time of{" "}
        <b>1-2 seconds</b>.
      </>,
      <>
        Built <b>Japanese character classifier</b>, utilizing{" "}
        <b>transfer learning</b> to recognize Hiragana and Katakana characters.
        The model was <b>containerized using Docker</b> for easy deployment.
      </>,
      <>
        <b>Increased efficiency</b> by writing <b>custom Python scripts</b> for
        data analysis after getting data from <b>Google My Business API</b> by
        using <b>pandas</b>. Updated the older script to match newer version of
        the API.
      </>,
    ],
    duration: "August 2022 - April 2023",
    link: "https://www.nishikawa.jp/",
  },
];

export { fetchExperience };
