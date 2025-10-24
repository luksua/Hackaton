import React, { useEffect, useState } from 'react';
import axios from 'axios';
import echo from '../../services/echo'; // 👈 tu archivo de Echo

interface ChatWindowProps {
    landlordId: number;
    userId: number;
    token: string;
    onBack?: () => void;
    onClose?: () => void;
}

interface ChatWindowProps {
    landlordId: number;   // id del propietario con quien hablará el inquilino
    userId: number;       // id del usuario autenticado
    token: string;        // token de autenticación Sanctum
}

export default function ChatWindow({ landlordId, userId, token }: ChatWindowProps) {
    const [conversationId, setConversationId] = useState<number | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [text, setText] = useState('');

    // 1️⃣ Abrir o crear conversación automáticamente
    useEffect(() => {
        const openConversation = async () => {
            try {
                const res = await axios.post(
                    '/api/conversations/open',
                    { landlord_id: landlordId },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setConversationId(res.data.id);
            } catch (error) {
                console.error('Error abriendo conversación:', error);
            }
        };

        openConversation();
    }, [landlordId, token]);

    // 2️⃣ Cargar mensajes e iniciar escucha en tiempo real
    useEffect(() => {
        if (!conversationId) return;

        // Cargar mensajes previos
        axios
            .get(`/api/messages/${conversationId}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => setMessages(res.data))
            .catch((err) => console.error('Error cargando mensajes:', err));

        // Escuchar en tiempo real
        const channel = echo.private(`conversation.${conversationId}`);

        channel.listen('.MessageSent', (event: any) => {
            console.log('📩 Nuevo mensaje recibido:', event);
            setMessages((prev) => [...prev, event.message]);
        });

        // Cleanup cuando se desmonta el componente
        return () => {
            echo.leaveChannel(`private-conversation.${conversationId}`);
        };
    }, [conversationId, token]);

    // 3️⃣ Enviar mensaje
    const sendMessage = async () => {
        if (!text.trim() || !conversationId) return;

        try {
            const res = await axios.post(
                '/api/messages',
                {
                    conversation_id: conversationId,
                    message: text,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setMessages((prev) => [...prev, res.data]);
            setText('');
        } catch (error) {
            console.error('Error enviando mensaje:', error);
        }
    };

    return (
        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
            <div>
                {onBack && (
                    <button className="btn btn-sm btn-light me-2" onClick={onBack}>
                        ←
                    </button>
                )}
                Chat con Propietario 💬
            </div>
            {onClose && (
                <button className="btn btn-sm btn-light" onClick={onClose}>
                    ✖
                </button>
            )}
        </div>

    );
}
