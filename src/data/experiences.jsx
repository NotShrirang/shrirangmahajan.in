const fetchExperience = () => [
  {
    id: 1,
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
        Engineered an <b>SQL AI Agent</b> for BI Dashboarding using{" "}
        <b>fine-tuned LLMs</b> for data retrieval through natural language;
        built a <b>ReactJS/Tailwind frontend</b>, <b>Django/Docker backend</b>,
        and interactive <b>Plotly dashboards</b> with <b>4s response time</b>.
      </>,
    ],
    duration: "June 2024 - Present",
    link: "https://www.ellicium.com/",
  },
  {
    id: 2,
    title: "Data Science Intern",
    company: "Emergys",
    description: [
      <>
        <b>Researched and implemented</b> optimized data retrieval techniques in{" "}
        <b>FAISS Vectorstore</b>, improving retrieval speed by <b>25-30%</b>,
        contributing to faster data access and enhanced model performance.
      </>,
      <>
        <b>Developed a legal document explainer tool</b> combining{" "}
        <b>Retrieval-Augmented Generation (RAG)</b> with <b>LLMs</b>,
        simplifying complex legal language for diverse users, and providing
        concise summaries within <b>5-7 seconds</b>.
      </>,
    ],
    duration: "January 2024 - June 2024",
    link: "https://www.ellicium.com/",
  },
  {
    id: 3,
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
    id: 4,
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
