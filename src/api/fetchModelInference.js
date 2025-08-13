
import Groq from "groq-sdk";

const fetchChatCompletion = async ({ query, context, history = [] }) => {
    if (!import.meta.env.VITE_GROQ_API_KEY) {
        throw new Error("Missing API key");
    }
    if (!query) {
        throw new Error("Missing query");
    }

    const systemPrompt = `You are a helpful assistant providing information about Shrirang Mahajan. Your task is to assist users with their inquiries and provide relevant information about Shrirang Mahajan's work and projects.

Context for this conversation:
${context}

Important Notes:
- Always respond in a professional and helpful manner.
- If you don't know the answer, politely inform the user that you cannot provide that information.
- Keep your responses concise and relevant to the user's inquiry.
- If the user asks for personal opinions or subjective judgments, strive to provide balanced and neutral information.
- Keep your answers focused related to Shrirang Mahajan's work and projects.
`;

    console.log(systemPrompt);

    const groq = new Groq({ apiKey: import.meta.env.VITE_GROQ_API_KEY, dangerouslyAllowBrowser: true });
    const completion = await groq.chat.completions.create({
        messages: [
            {
                role: "system",
                content: systemPrompt,
            },
            ...history.map((msg) => ({
                role: msg.sender === "user" ? "user" : "assistant",
                content: msg.text,
            })),
            {
                role: "user",
                content: query,
            },
        ],
        model: "openai/gpt-oss-20b",
    }).then((chatCompletion) => {
        return chatCompletion.choices[0]?.message?.content || "";
    });
    return completion;
}

export { fetchChatCompletion }