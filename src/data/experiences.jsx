const fetchExperience = () => [
  {
    id: 1,
    title: "Data Scientist",
    company: "Emergys Solutions Inc. (Formerly Ellicium Solutions Inc.)",
    description: [
      <>
        Engineered <b>ML-powered promo-sales simulation system</b> enabling data
        uploads, scenario visualization, and <b>custom model training</b> for
        sales prediction, enhanced by <b>global optimizer</b> for data-driven
        promotional strategies
      </>,
      <>
        Architected <b>AI-driven data assistant</b> with interactive dashboard,
        transforming <b>CSV datasets</b> into <b>on-demand analysis</b> via
        natural language queries and <b>LLM-powered automation</b> (responses in{" "}
        <b>5-7 seconds</b>)
      </>,
    ],
    duration: "June 2024 - Present",
    link: "https://www.ellicium.com/",
  },
  {
    id: 2,
    title: "Data Science Intern",
    company: "Emergys Solutions Inc. (Formerly Ellicium Solutions Inc.)",
    description: [
      `Researched and implemented optimized data retrieval techniques in FAISS Vectorstore, improving retrieval speed
by 25-30%, contributing to faster data access and enhanced model performance.`,
      `Developed a legal document explainer tool combining Retrieval-Augmented Generation (RAG) with LLMs,
simplifying complex legal language for diverse users, and providing concise summaries within 5-7 seconds.`,
    ],
    duration: "January 2024 - June 2024",
    link: "https://www.ellicium.com/",
  },
  {
    id: 3,
    title: "SDE Intern",
    company: "Atomic Loops",
    description: [
      `Engineered backend REST APIs using Django REST Framework for diverse products, facilitating data generation
and collection for training ML models. Designed and implemented app for Yoga pose detection using Flutter.`,
      `Designed and implemented app for Yoga pose detection using Flutter.`,
    ],
    duration: "April 2023 - December 2024",
    link: "https://atomicloops.com/",
  },
  {
    id: 4,
    title: "ML Intern",
    company: "Nishikawa Communications Pvt. Ltd.",
    description: [
      `Developed an image straightener tool using OpenCV and TesseractOCR. This system automatically corrects titled
or flipped images, delivering results in a rapid response time of 1-2 seconds.`,
      `Designed and implemented a Japanese character classifier for a company, utilizing transfer learning to recognize
Hiragana and Katakana characters. The model was containerized using Docker for easy deployment.`,
    ],
    duration: "August 2022 - April 2023",
    link: "https://www.nishikawa.jp/",
  },
];

export { fetchExperience };
