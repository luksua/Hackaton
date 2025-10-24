<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Property extends Model
{
    use HasFactory;

    protected $fillable = [
        'owner_id',
        'category_id',
        'address',
        'city',
        'area',
        'price',
        'description',
        'bedrooms',
        'bathrooms',
        'is_featured',
        'latitude',
        'longitude',
    ];

    protected $casts = [
        'is_featured' => 'boolean',
        'latitude' => 'float',
        'longitude' => 'float',
        'price' => 'float',
        'area' => 'float',
    ];

    // Relaciones

    // Propietario
    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    // Categoría (Casa, Apartamento, etc)
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    // Contratos asociados
    public function contracts()
    {
        return $this->hasMany(Contract::class);
    }

    public function images()
    {
        return $this->hasMany(PropertyImage::class);
    }

    public function features()
    {
        return $this->hasMany(PropertyFeature::class);
    }
    // venta
    public function sale()
    {
        return $this->hasOne(Sale::class);
    }
}
