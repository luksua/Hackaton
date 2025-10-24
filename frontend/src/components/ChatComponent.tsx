import React, { useEffect } from 'react';
import echo from '../services/echo'; // Importa el archivo de configuración de Echo

const ChatComponent: React.FC = () => {
    useEffect(() => {
        // Escuchar un canal de "chat" y el evento "MessageSent"
        echo.channel('chat')
            .listen('MessageSent', (event: any) => {
                console.log('Nuevo mensaje recibido:', event);
            });

        // Limpiar la escucha del evento cuando el componente se desmonte
        return () => {
            echo.channel('chat').stopListening('MessageSent');
        };
    }, []);

    return (
        <div>
            <h2>Chat Component</h2>
            <p>Escuchando mensajes...</p>
        </div>
    );
};

export default ChatComponent;
