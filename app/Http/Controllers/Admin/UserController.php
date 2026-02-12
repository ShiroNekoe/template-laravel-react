<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;


class UserController extends Controller
{
   public function index()
{
    return inertia('Admin/Users', [
        'users' => \App\Models\User::latest()->get()
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
