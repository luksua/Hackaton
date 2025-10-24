<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Conversation extends Model
{
    use HasFactory;

    protected $fillable = [
        'tenant_id',
        'landlord_id',
    ];

    // 🔹 Relación: una conversación tiene muchos mensajes
    public function messages()
    {
        return $this->hasMany(Message::class);
    }

    // 🔹 Relación: inquilino (usuario)
    public function tenant()
    {
        return $this->belongsTo(User::class, 'tenant_id');
    }

    // 🔹 Relación: propietario (usuario)
    public function landlord()
    {
        return $this->belongsTo(User::class, 'landlord_id');
    }
}
