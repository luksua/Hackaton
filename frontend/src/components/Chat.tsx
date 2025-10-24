import React, { useEffect, useState } from 'react';
import echo from '../services/echo';
import axios from 'axios';

interface Message {
    id: number;
    sender_id: number;
    receiver_id: number;
    message: string;
    created_at: string;
}

interface ChatProps {
    receiverId: number;
    userId: number;
}

export default function Chat({ receiverId, userId }: ChatProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [text, setText] = useState('');

    // 🧩 Cargar mensajes iniciales y suscribirse al canal
    useEffect(() => {
        // Cargar historial de mensajes
        axios
            .get(`/api/messages/${receiverId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            })
            .then((res) => setMessages(res.data))
            .catch((err) => console.error('Error cargando mensajes:', err));

        // Escuchar eventos en tiempo real
        const channel = echo.channel(`chat.${userId}`);
        channel.listen('MessageSent', (event: any) => {
            console.log('📩 Nuevo mensaje recibido:', event);
            setMessages((prev) => [...prev, event.message]);
        });

        // Limpiar la suscripción cuando el componente se desmonte
        return () => {
            echo.leaveChannel(`chat.${userId}`);
        };
    }, [receiverId, userId]);

    // 📨 Enviar mensaje
    const sendMessage = async () => {
        if (!text.trim()) return;

        try {
            const res = await axios.post(
                '/api/messages',
                {
                    receiver_id: receiverId,
                    message: text,
                },
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                }
            );

            setMessages((prev) => [...prev, res.data]);
            setText('');
        } catch (error) {
            console.error('Error enviando mensaje:', error);
        }
    };

    return (
        <div className="chat-box border rounded p-3 bg-light">
            <div className="messages mb-2" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {messages.map((m) => (
                    <div
                        key={m.id}
                        className={`p-2 my-1 rounded ${m.sender_id === userId ? 'bg-success text-white ms-auto' : 'bg-secondary text-white me-auto'
                            }`}
                        style={{ width: 'fit-content' }}
                    >
                        {m.message}
                    </div>
                ))}
            </div>
            <div className="input d-flex">
                <input
                    className="form-control me-2"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Escribe un mensaje..."
                />
                <button className="btn btn-primary" onClick={sendMessage}>
                    Enviar
                </button>
            </div>
        </div>
    );
}
