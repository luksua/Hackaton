import React, { useEffect, useState } from "react";
import axios from "axios";

interface Conversation {
    id: number;
    landlord: { id: number; name: string };
    tenant: { id: number; name: string };
}

interface Props {
    userId: number;
    onSelect: (conv: { id: number; landlordId: number }) => void;
    onClose: () => void;
}

const ConversationList: React.FC<Props> = ({ userId, onSelect, onClose }) => {
    const [conversations, setConversations] = useState<Conversation[]>([]);

    useEffect(() => {
        axios
            .get("/api/conversations", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            })
            .then((res) => setConversations(res.data))
            .catch((err) => console.error("Error cargando conversaciones:", err));
    }, []);

    return (
        <div
            className="card shadow-sm position-fixed bottom-0 end-0 m-3"
            style={{ width: "360px", height: "450px", zIndex: 1060 }}
        >
            <div className="card-header bg-primary text-white d-flex justify-content-between">
                <span>Conversaciones</span>
                <button className="btn btn-sm btn-light" onClick={onClose}>
                    ✖
                </button>
            </div>

            <div className="card-body overflow-auto">
                {conversations.length === 0 ? (
                    <p className="text-muted text-center">No tienes conversaciones aún.</p>
                ) : (
                    conversations.map((c) => {
                        const contact =
                            c.landlord.id === userId ? c.tenant : c.landlord;
                        return (
                            <div
                                key={c.id}
                                className="p-2 border-bottom d-flex justify-content-between align-items-center"
                                style={{ cursor: "pointer" }}
                                onClick={() => onSelect({ id: c.id, landlordId: contact.id })}
                            >
                                <div>
                                    <strong>{contact.name}</strong>
                                </div>
                                <span className="text-primary">💬</span>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default ConversationList;
