const fetchExperience = () => [
  {
    id: 1,
    title: "Machine Learning Engineer - II",
    company: "Skylark Labs",
    description: [
      <>
        Developed a production-grade <b>visual tracking system</b> featuring a{" "}
        <b>7D Kalman filter</b> for multi-object tracking and predictive PiP
        stabilization. Built an offline standalone tracker with{" "}
        <b>Camera Motion Compensation</b> using sparse optical flow and affine
        estimation, handling complex re-identification and dynamic state
        switches.
      </>,
      <>
        Optimized inference by deploying a <b>TensorRT-optimized model</b> on{" "}
        <b>NVIDIA Triton Inference Server</b>, doubling throughput from{" "}
        <b>3 FPS to 6–7 FPS</b> via profiling and optimized post-processing
        logic over <b>gRPC</b>.
      </>,
      <>
        Architected and developed <b>Drishti</b>, a{" "}
        <b>distributed annotation system</b> processing video datasets with{" "}
        <b>GPU-accelerated</b> YOLO inference on Celery workers, automated
        quality control, smart work distribution, and real-time batch
        processing, deployed as a full-stack solution (
        <b>Django + React + PostgreSQL + Docker</b>) with <b>Cloudflare R2</b>{" "}
        integration, improving annotation throughput by <b>3x</b>.
      </>,
      <>
        Worked on continuous training and validation of a{" "}
        <b>YOLO-based object detection model</b>, including hyperparameter
        tuning and false-positive analysis.
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
    link: "https://www.ellicium.com/",
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
    duration: "April 2023 - December 2024",
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
