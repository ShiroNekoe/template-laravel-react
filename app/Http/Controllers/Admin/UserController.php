<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Inertia\Inertia;


class UserController extends Controller
{
   public function index()
{
    return inertia('Admin/user/Users', [
        'users' => User::latest()->get()
    ]);
}

   public function show(User $user)
    {
        $user->load('orders');

        return Inertia::render('Admin/user/order-detail-user', [
            'user' => $user
        ]);
    }

public function update(Request $request, User $user)
{
    $user->update($request->validate([
        'name' => 'required',
        'email' => 'required|email',
        'role' => 'required|in:user,admin',
        'address' => 'nullable',
    ]));

    return redirect()->back();
}

public function destroy(User $user)
{
    $user->delete();
    return redirect()->back();
}

}
