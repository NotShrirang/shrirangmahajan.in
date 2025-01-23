const fetchExperience = () => [
    {
        "id": 1,
        "title": "Data Scientist",
        "company": "Emergys Solutions Inc.",
        "description": [`Spearheaded the development of a promo-sales simulation system, enabling customers to upload sales data,
visualize product, event, and discount scenarios, and train custom ML models to predict sales and optimize
promotional strategies with a focus on model efficiency and scalability. Integrated a global optimizer that provides
data-driven recommendations for optimal scenarios to maximize business outcomes.`, `Led the development of an AI-powered data assistant with interactive dashboard, enabling non-technical users to
query CSV datasets via natural language. Automated filtering, summarization, and visualization tasks, delivering
on-demand data analysis with tables, graphs, and charts. Integrated LLMs to optimize query handling increasing
productivity with response time of 5-7 seconds.`],
        "duration": "June 2024 - Present"
    },
    {
        "id": 2,
        "title": "SDE Intern",
        "company": "Atomic Loops",
        "description": [`Engineered backend REST APIs using Django REST Framework for diverse products, facilitating data generation
and collection for training ML models. Designed and implemented app for Yoga pose detection using Flutter.`, `Designed and implemented app for Yoga pose detection using Flutter.`],
        "duration": "April 2023 - December 2024"
    },
    {
        "id": 3,
        "title": "ML Intern",
        "company": "Nishikawa Communications Pvt. Ltd.",
        "description": [`Developed an image straightener tool using OpenCV and TesseractOCR. This system automatically corrects titled
or flipped images, delivering results in a rapid response time of 1-2 seconds.`, `Designed and implemented a Japanese character classifier for a company, utilizing transfer learning to recognize
Hiragana and Katakana characters. The model was containerized using Docker for easy deployment.`],
        "duration": "August 2022 - April 2023"
    }
]

export { fetchExperience };