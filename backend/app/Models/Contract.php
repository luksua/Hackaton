<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contract extends Model
{
    use HasFactory;

    protected $fillable = [
        'property_id',
        'tenant_id',
        'start_date',
        'end_date',
        'monthly_rent',
        'status',
        'file_path',        
    ];

    // Relaciones
    // Propiedad asociada
    public function property()
    {
        return $this->belongsTo(Property::class);
    }

    // Inquilino asociado
    public function tenant()
    {
        return $this->belongsTo(User::class, 'tenant_id');
    }
    
    // Facturas asociadas
  public function bills()
{
    return $this->morphMany(Bill::class, 'billable');
}

}
