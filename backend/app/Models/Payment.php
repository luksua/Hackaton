<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'bill_id',
        'payment_date',
        'amount',
        'payment_method',
        'notes',
    ];

    // Relaciones

    // Factura asociada
    public function bill()
    {
        return $this->belongsTo(Bill::class);
    }
}
