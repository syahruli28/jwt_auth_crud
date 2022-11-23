<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */

    public $url = "http://localhost:8000/storage/product/";

    public function index()
    {
        // ambil datanya
        $produk = Product::all();

        // tampilkan responsenya
        return new ProductResource(true, 'List Data Product', $produk);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        // inisiasi validasi
        $validator = Validator::make($request->all(), [
            'nama' => 'required|min:5',
            'harga' => 'required',
            'gambar' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048'
        ]);

        // cek validasi
        if ($validator->fails()) {
            // jika gagal tampilkan error dengan kode 422
            return response()->json($validator->errors(), 422);
        }

        //upload image (jangan lupa php artisan storage:link)
        $image = $request->file('gambar');
        $image->storeAs('public/product', $image->hashName());

        // masukan datanya ke tb
        $product = Product::create([
            'nama' => $request->nama,
            'harga' => $request->harga,
            'gambar' => $image->hashName(),
            'url' => $this->url . $image->hashName(),
        ]);

        // tampilkan responsenya
        return new ProductResource(true, 'Data Product Has Been Added', $product);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Product $product)
    {
        // tampilkan responsenya
        return new ProductResource(true, 'Data Ditemukan', $product);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Product $product)
    {
        // inisiasi validasi, cek apakah ada gambarnya
        if ($request->hasFile('gambar')) {
            $validator = Validator::make($request->all(), [
                'nama' => 'required|min:5',
                'harga' => 'required',
                'gambar'     => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048'
            ]);
        } else { // jika tidak ada gambar
            $validator = Validator::make($request->all(), [
                'nama' => 'required|min:5',
                'harga' => 'required'
                // 'gambar'     => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048'
            ]);
        }

        // cek validasi
        if ($validator->fails()) {
            // jika gagal tampilkan error dengan kode 422
            return response()->json($validator->errors(), 422);
        }

        //check if image is uploaded
        if ($request->hasFile('gambar')) {

            //upload new image
            $image = $request->file('gambar');
            $image->storeAs('public/product', $image->hashName());

            //delete old image
            Storage::delete('public/product/' . $product->gambar);

            //update post with new image
            $product->update([
                'nama'     => $request->nama,
                'harga'     => $request->harga,
                'gambar'     => $image->hashName(),
                'url' => $this->url . $image->hashName(),
            ]);
        } else {

            //update post without image
            $product->update([
                'nama'     => $request->nama,
                'harga'     => $request->harga
            ]);
        }

        // tampilkan responsenya
        return new ProductResource(true, 'Data Product Has Been Updated', $product);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Product $product)
    {
        //delete image
        Storage::delete('public/product/' . $product->gambar);

        //delete post
        $product->delete();

        // tampilkan responsenya
        return new ProductResource(true, 'Data Product Has Been Deleted', null);
    }
}
