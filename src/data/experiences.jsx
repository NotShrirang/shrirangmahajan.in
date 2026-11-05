const fetchExperience = () => [
  {
    id: 1,
    title: "Machine Learning Engineer - II",
    company: "Skylark Labs",
    description: [
      <>
        Sole ML engineer since September 2026, working with 3 SDEs and a
        product manager.
      </>,
      <>
        <b>Video analytics platform (Kepler):</b> built most of the CCTV and
        drone analytics (fire/smoke, PPE, ANPR, weapons, intrusion, crowd
        counting) and face recognition, served over gRPC on multiple hardware
        backends (Triton, Jetson, ONNX, CPU). Scales from{" "}
        <b>4 cameras on a Jetson AGX Orin to 40 on an A5000 cluster</b> at{" "}
        <b>400 ms P99</b>.
      </>,
      <>
        <b>Inference performance:</b> cut retrieval latency{" "}
        <b>88% (971 → 113 ms)</b> by searching Qdrant embeddings only around
        detected objects and caching features to skip <b>87%</b> of repeat
        model calls. <b>Doubled throughput (3 → 7 FPS)</b> with TensorRT on
        NVIDIA Triton, at <b>120+ inferences/s under 50 ms P95</b>.
      </>,
      <>
        <b>Aircraft tracking system:</b> owned end to end as sole engineer, live
        at an operational airfield. Tracked{" "}
        <b>1,400+ takeoffs and landings</b> with the aircraft{" "}
        <b>in frame 90%</b> of the time, at <b>22 FPS</b>, using YOLO, visual
        odometry, SIFT/RANSAC pose correction and predictive PTZ control.
      </>,
      <>
        <b>Edge deployment:</b> designed a TensorRT gRPC inference server for
        road-damage detection (YOLO11) on Jetson AGX Orin, shipped as a
        .deb/systemd service. Cut per-frame time{" "}
        <b>2.7× (65 → 24 ms)</b>, mostly by rewriting preprocessing.
      </>,
      <>
        <b>FrameSeek (prototype):</b> natural-language CCTV search where any LLM
        (Claude, GPT, Gemini, Groq) queries an offline video index through{" "}
        <b>19 MCP tools</b>. Index built with YOLO26, ByteTrack, SigLIP2 and
        DINOv2.
      </>,
      <>
        <b>Drishti:</b> built the team's annotation platform with GPU
        pre-labelling on Celery workers and automated QC,{" "}
        <b>tripling annotation throughput</b> (Django, React, PostgreSQL,
        Docker).
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
        Led development of an <b>LLM agent for BI analytics</b> that turns
        plain-English questions into SQL and charts,{" "}
        <b>cutting query turnaround 90%</b> to under 5 s. Deployed to multiple
        enterprise clients as a <b>core revenue product</b>.
      </>,
      <>
        Built a promo-sales forecasting model (gradient boosting,{" "}
        <b>R² 0.93</b>) on Azure Databricks, with TPE hyperparameter search, to
        plan promotions.
      </>,
      <>
        Owned a <b>price-outlier detection system</b> end to end, from
        clustering and supplier-concentration metrics to the stakeholder
        dashboard.
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
