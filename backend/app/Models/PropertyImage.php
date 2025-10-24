<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PropertyImage extends Model
{
    use HasFactory;

    protected $fillable = ['property_id', 'image_url'];
     protected $appends = ['url'];

    public function getUrlAttribute()
    {
        if (str_starts_with($this->image_url, 'http')) {
            return $this->image_url;
        }
        return asset('storage/' . $this->image_url);
    }

    public function property()
    {
        return $this->belongsTo(Property::class);
    }

    
}
