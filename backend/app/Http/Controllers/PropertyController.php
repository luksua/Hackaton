<?php

namespace App\Http\Controllers;

use App\Models\Property;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PropertyController extends Controller
{
    /**
     * Listar TODAS las propiedades (vista pública)
     * GET /api/properties
     */
    public function index(Request $request)
    {
        $query = Property::with(['images', 'category', 'owner'])
            ->orderBy('created_at', 'desc');

        // 🔍 Filtros opcionales: ciudad, categoría, estado, tipo y precio
        if ($request->filled('city')) {
            $query->where('city', 'like', '%' . $request->city . '%');
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('transaction_type')) {
            $query->where('transaction_type', $request->transaction_type);
        }

        // Filtro de disponibilidad
        if ($request->has('listing_status')) {
            $query->where('listing_status', $request->input('listing_status'));
        }

        // Filtro de tipo de venta
        if ($request->has('sale_type')) {
            $query->where('sale_type', $request->input('sale_type'));
        }

        // Filtro de ubicación (latitud y longitud)
        if ($request->has('latitude') && $request->has('longitude')) {
            $latitude = $request->input('latitude');
            $longitude = $request->input('longitude');
            $distance = 50; // ejemplo: buscar en un radio de 50 km

            $query->whereRaw("ST_Distance_Sphere(POINT(longitude, latitude), POINT(?, ?)) <= ?", [$longitude, $latitude, $distance * 1000]);
        }

        $properties = $query->paginate(12);

        return response()->json($properties);
    }

    /**
     * ⭐ Propiedades destacadas
     * GET /api/properties/featured
     */
    public function featured()
    {
        $properties = Property::with('images')
            ->where('is_featured', true)
            ->latest()
            ->take(6)
            ->get();

        return response()->json($properties);
    }

    /**
     * 👤 Propiedades por propietario
     * GET /api/properties/owner/{id}
     */
    public function byOwner(Request $request, $id)
    {
        $query = Property::with(['images', 'category'])
            ->where('owner_id', $id)
            ->orderBy('created_at', 'desc');

        // filtros opcionales
        if ($request->filled('city')) {
            $query->where('city', 'like', '%' . $request->city . '%');
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('transaction_type')) {
            $query->where('transaction_type', $request->transaction_type);
        }

        if ($request->filled('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }

        if ($request->filled('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        // Paginación
        $properties = $query->paginate(8); // muestra 8 propiedades por página

        return response()->json($properties);
    }


    /**
     *  Crear propiedad
     * POST /api/properties
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'address' => 'required|string|max:255',
            'city' => 'required|string|max:100',
            'area' => 'nullable|numeric',
            'price' => 'nullable|numeric',
            'description' => 'nullable|string',
            'bedrooms' => 'nullable|integer',
            'bathrooms' => 'nullable|integer',
            'is_featured' => 'boolean',
            'status' => 'nullable|string|in:disponible,rentada,inactiva',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'images.*' => 'image|mimes:jpeg,png,jpg,webp|max:4096'
        ]);

        $data['owner_id'] = auth()->id();
        $property = Property::create($data);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('properties', 'public');
                $property->images()->create(['image_url' => $path]);
            }
        }

        return response()->json([
            'message' => 'Propiedad creada correctamente',
            'property' => $property->load('images'),
        ], 201);
    }

    /**
     * 📄 Mostrar una propiedad específica
     */
    public function show($id)
    {
        $property = Property::with('images')->findOrFail($id);
        return response()->json($property);
    }

    /**
     * ✏️ Actualizar propiedad
     */
    public function update(Request $request, $id)
    {
        $property = Property::findOrFail($id);

        $property->update($request->only([
            'category_id',
            'address',
            'city',
            'area',
            'price',
            'description',
            'bedrooms',
            'bathrooms',
            'is_featured',
            'status',
            'latitude',
            'longitude'
        ]));

        return response()->json([
            'message' => 'Propiedad actualizada correctamente',
            'property' => $property,
        ]);
    }

    /**
     * 🗑️ Eliminar propiedad y sus imágenes
     */
    public function destroy($id)
    {
        $property = Property::findOrFail($id);

        foreach ($property->images as $img) {
            Storage::disk('public')->delete($img->image_url);
            $img->delete();
        }

        $property->delete();

        return response()->json(['message' => 'Propiedad eliminada correctamente']);
    }

    public function getFilteredProperties(Request $request)
    {
        $q = Property::query()->with(['images', 'category', 'owner']);

        if ($request->filled('query')) {
            $term = $request->query('query');
            $q->where(function ($sub) use ($term) {
                $sub->where('city', 'like', "%{$term}%")
                    ->orWhere('address', 'like', "%{$term}%")
                    ->orWhere('description', 'like', "%{$term}%");
            });
        }

        if ($request->filled('location')) {
            $q->where('city', 'like', "%{$request->query('location')}%");
        }

        // Si tu frontend envía "propertyType" con texto, mapea a category_id si corresponde
        if ($request->filled('propertyType')) {
            // ejemplo si mapeas manualmente
            $map = ['Casa' => 1, 'Apartamento' => 2, 'Local' => 3];
            $cat = $map[$request->query('propertyType')] ?? null;
            if ($cat)
                $q->where('category_id', $cat);
        }

        if ($request->filled('operationType')) {
            // Mapea Arriendo/Venta a rent/sale si tu DB guarda así
            $map = ['Arriendo' => 'rent', 'Venta' => 'sale'];
            $tx = $map[$request->query('operationType')] ?? $request->query('operationType');
            $q->where('transaction_type', $tx);
        }

        return response()->json($q->get(), 200);
    }
}
