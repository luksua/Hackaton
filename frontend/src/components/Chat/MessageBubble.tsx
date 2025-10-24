import type { MessageBubbleProps } from "../../types/menssges";


const MessageBubble: React.FC<MessageBubbleProps> = ({ sender, text }) => {
  const isUser = sender === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-xs px-4 py-2 rounded-2xl ${
          isUser
            ? "bg-green-600 text-white rounded-br-none"
            : "bg-gray-200 text-gray-900 rounded-bl-none"
        }`}
      >
        {text}
      </div>
    </div>
  );
};

export default MessageBubble;
