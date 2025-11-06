import { RedisClient } from "@/lib/redis";
import axios from "axios";
import { NextResponse } from "next/server";

export async function GET() {
  if (!RedisClient.isOpen) {
    await RedisClient.connect();
  }

  const cacheKey = "myData";

  try {
    const cached = await RedisClient.get(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      return NextResponse.json(parsed);
    }

    const { data } = await axios.get(
      "https://api.github.com/repos/TanStack/query",
    );

    await RedisClient.setEx(cacheKey, 60, JSON.stringify(data));

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 },
    );
  }
}
