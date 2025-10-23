<?php

namespace App\Http\Controllers;

use App\Models\PropertyImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PropertyImageController extends Controller
{
    public function store(Request $request)
{
    $request->validate([
        'property_id' => 'required|exists:properties,id',
        'images.*' => 'required|image|mimes:jpg,jpeg,png,webp|max:5120',
    ]);

    $images = [];

    foreach ($request->file('images') as $file) {
        $path = $file->store('property_images', 'public'); // ✅ usa el disco public

        $image = PropertyImage::create([
            'property_id' => $request->property_id,
            'image_url' => url('storage/property_images/' . basename($path)),
        ]);

        $images[] = $image;
    }

    return response()->json([
        'message' => 'Imágenes subidas correctamente',
        'images' => $images,
    ], 201);
}


    public function index($propertyId)
    {
        $images = PropertyImage::where('property_id', $propertyId)->get();
        return response()->json($images);
    }

    public function destroy($id)
    {
        $image = PropertyImage::findOrFail($id);

        if ($image->image_url && str_contains($image->image_url, 'storage/')) {
            $filePath = str_replace(asset('storage/property_images/') . '/', '', $image->image_url);
            Storage::disk('public')->delete('property_images/' . $filePath);
        }

        $image->delete();

        return response()->json(['message' => 'Imagen eliminada correctamente']);
    }
}
