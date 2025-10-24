<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Bill extends Model
{
    use HasFactory;

    protected $fillable = [
        'billable_id',
        'billable_type',
        'due_date',
        'amount',
        'status',
        'description',
    ];

    // 🔗 Relación polimórfica
    public function billable()
    {
        return $this->morphTo();
    }

    // 💳 Pagos asociados
    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    // 💰 Total pagado
    public function getTotalPaidAttribute()
    {
        return $this->payments()->sum('amount');
    }

    // ✅ Estado dinámico
    public function getIsPaidAttribute()
    {
        return $this->status === 'paid' || $this->total_paid >= $this->amount;
    }
}
