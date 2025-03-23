"use client";

import Link from "next/link";

export default function Sidebar() {
    return (
        <div className="w-64 h-screen bg-gray-800 text-white p-4">
            <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
            <ul className="space-y-2">
                <li><Link href="/admin/dashboard">Dashboard</Link></li>
                <li><Link href="/admin/users">User Management</Link></li>
                <li><Link href="/admin/recycling">Bottle Collection</Link></li>
                <li><Link href="/admin/rewards">Cashback & Rewards</Link></li>
                <li><Link href="/admin/orders">E-Commerce</Link></li>
            </ul>
        </div>
    );
}
