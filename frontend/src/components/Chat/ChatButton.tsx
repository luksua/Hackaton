import React, { useState } from "react";
import { MessageCircle } from "lucide-react";
import ChatWindow from "./ChatWindow";
import ConversationList from "./ConversationList";
import { useAuth } from "../../Hooks/UseAuth";

const ChatButton: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [conversation, setConversation] = useState<{ id: number; landlordId: number } | null>(null);
  const { user } = useAuth();

  if (!user) return null;

  return (
    <>
      {/* Botón flotante */}
      <button
        type="button"
        className="btn btn-success rounded-circle shadow position-fixed"
        style={{
          bottom: "25px",
          right: "25px",
          width: "60px",
          height: "60px",
          zIndex: 1050,
        }}
        onClick={() => setOpen(!open)}
      >
        <MessageCircle size={26} />
      </button>

      {/* Ventana de chat */}
      {open && !conversation && (
        <ConversationList
          userId={user.id}
          onSelect={(conv) => setConversation(conv)}
          onClose={() => setOpen(false)}
        />
      )}

      {conversation && (
        <ChatWindow
          landlordId={conversation.landlordId}
          userId={user.id}
          token={localStorage.getItem("token")!}
          onBack={() => setConversation(null)}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
};

export default ChatButton;
