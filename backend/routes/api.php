<?php

use App\Http\Controllers\Api\ProductController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Route group = hanya dapat menjalankan route yang ada didalam group jika sudah punya login/token
Route::group(['middleware' => 'auth:api'], function () {

    // ambil data user
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // logout dan hapus token
    Route::post('/logout', \App\Http\Controllers\Api\LogoutController::class)->name('logout');

    Route::apiResource('/product', ProductController::class);
});

Route::post('/register', \App\Http\Controllers\Api\RegisterController::class)->name('register');
Route::post('/login', \App\Http\Controllers\Api\LoginController::class)->name('login');


// Route::middleware('auth:api')->get('/user', function (Request $request) {
//     return $request->user();
// });
