import React, { useState, useEffect } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

import styles from "./Chatbot.module.css";
import ChatBotIcon from "../../assets/images/chatbot.svg";
import CloseIcon from "../../assets/images/dropdown.svg";
import SendIcon from "../../assets/images/send.svg";
import { fetchChatCompletion } from "../../api/fetchModelInference";
import { fetchExperience } from "../../data/experiences";
import { projects } from "../../data/projects";
import skills from "../../data/skills";
import reactElementToString from "../../utils/reactElementToString";

const Chatbot = () => {
  const [clicked, setClicked] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initialMessages = [
      { id: 1, sender: "assistant", text: "Hello! How can I help you today?" },
    ];
    setMessages(initialMessages);
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const message = {
      id: messages.length + 1,
      sender: "user",
      text: newMessage,
    };
    setMessages([...messages, message]);
    setLoading(true);
    const aiResponse = await fetchChatCompletion({
      query: newMessage,
      context: `Shrirang Mahajan's Work:

Projects:

${projects
  .map(
    (project) =>
      `name: ${project.title.toString()}
    description: ${reactElementToString(project.description)}`
  )
  .join("\n\n")}

Skills: ${skills.map((skill) => skill.name).join(", ")}

Experience:

${fetchExperience()
  .map(
    (exp) =>
      `Role: ${exp.title}
    Company: ${exp.company}
    Description: ${reactElementToString(exp.description)}`
  )
  .join("\n\n")}
`,
      history: messages,
    });

    if (aiResponse) {
      setMessages([
        ...messages,
        message,
        { id: messages.length + 2, sender: "assistant", text: aiResponse },
      ]);
      setNewMessage("");
      setLoading(false);
    } else {
      setMessages([
        ...messages,
        message,
        {
          id: messages.length + 2,
          sender: "assistant",
          text: "Sorry, I couldn't process your request.",
        },
      ]);
      setNewMessage("");
      setLoading(false);
    }
  };

  if (!clicked)
    return (
      <div className={styles.chatbotContainer} onClick={() => setClicked(true)}>
        <img
          src={ChatBotIcon}
          alt="Chatbot Icon"
          className={styles.chatbotIcon}
        />
      </div>
    );
  else
    return (
      <div className={styles.chatbotContainerExpanded}>
        <div className={styles.chatbotHeader}>
          <div className={styles.chatbotIconContainer}>
            <img
              src={ChatBotIcon}
              alt="Chatbot Icon"
              className={styles.chatbotIcon}
            />
            <h2 className={styles.chatbotTitle}>Chatbot</h2>
          </div>
          <div
            className={styles.chatbotButton}
            onClick={() => setClicked(false)}
          >
            <img src={CloseIcon} alt="Close" className={styles.chatbotIcon} />
          </div>
        </div>
        <div className={styles.chatbotContent}>
          <div className={styles.chatbotMessages}>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`${styles.chatbotMessage} ${
                  message.sender === "assistant"
                    ? styles.aiMessage
                    : styles.userMessage
                }`}
              >
                {message.sender === "user" ? (
                  message.text
                ) : (
                  <Markdown remarkPlugins={[remarkGfm]}>
                    {message.text}
                  </Markdown>
                )}
              </div>
            ))}
            {loading && (
              <div className={styles.loadingIndicator}>Typing...</div>
            )}
          </div>
          <form
            action=""
            className={styles.chatbotInputContainer}
            onSubmit={(e) => {
              if (newMessage.trim()) {
                handleSendMessage(e);
              }
            }}
          >
            <input
              type="text"
              className={styles.chatbotInput}
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <img
              src={SendIcon}
              alt="Send"
              className={styles.chatbotSendButton}
              onClick={(e) => {
                if (newMessage.trim()) {
                  handleSendMessage(e);
                }
              }}
            />
          </form>
        </div>
      </div>
    );
};

export default Chatbot;
