<?php

namespace App\Events;

use App\Models\Message;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Queue\SerializesModels;

class MessageSent implements ShouldBroadcast
{
    use InteractsWithSockets, SerializesModels;

    public $message;

    /**
     * Crear nueva instancia del evento
     */
    public function __construct(Message $message)
    {
        // Incluye el remitente y la conversación para el frontend
        $this->message = $message->load('sender', 'conversation');
    }

    /**
     * Canal privado por el que se transmitirá el mensaje
     */
    public function broadcastOn()
    {
        // Canal único por conversación
        return new PrivateChannel('conversation.' . $this->message->conversation_id);
    }

    /**
     * Nombre del evento (opcional, para claridad en frontend)
     */
    public function broadcastAs()
    {
        return 'MessageSent';
    }

    /**
     * Datos que se enviarán al frontend
     */
    public function broadcastWith()
    {
        return [
            'message' => [
                'id' => $this->message->id,
                'conversation_id' => $this->message->conversation_id,
                'sender_id' => $this->message->sender_id,
                'message' => $this->message->message,
                'created_at' => $this->message->created_at->toDateTimeString(),
                'sender' => [
                    'id' => $this->message->sender->id,
                    'name' => $this->message->sender->name ?? 'Usuario',
                ],
            ],
        ];
    }
}
