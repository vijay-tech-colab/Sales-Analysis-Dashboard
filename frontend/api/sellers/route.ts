import { NextResponse } from "next/server";

export async function GET() {
  const fakeSellers = Array.from({ length: 10 }, (_, i) => ({
    id: `s${i + 1}`,
    name: `Seller ${i + 1}`,
    email: `seller${i + 1}@example.com`,
    phone: `+91-99999${i}00${i}`,
    image: `https://i.pravatar.cc/40?img=${i + 1}`,
    sales: Math.floor(Math.random() * 100000),
    rating: (Math.random() * 5).toFixed(1),
    status: ["Active", "Pending", "Suspended"][i % 3],
    region: ["North", "South", "East", "West"][i % 4],
  }));

  return NextResponse.json(fakeSellers);
}
