<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sale extends Model
{
    use HasFactory;

    protected $fillable = [
        'property_id',
        'tenant_id',
        'total_amount',
        'sale_type',
        'installments',
        'installment_amount',
        'sale_date',
    ];

    public function property()
    {
        return $this->belongsTo(Property::class);
    }

    public function tenant()
    {
        return $this->belongsTo(User::class, 'tenant_id');
    }

    // Si la venta es a crédito, tendrá bills
    public function bills()
{
    return $this->morphMany(Bill::class, 'billable');
}


public function payments()
{
    return $this->hasManyThrough(Payment::class, Bill::class);
}
}
