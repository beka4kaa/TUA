import { NextRequest, NextResponse } from "next/server";
import { getPublishedPosts, getAllTags } from "@/lib/blog";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "9");
    const tagSlug = searchParams.get("tag") || undefined;
    
    const result = await getPublishedPosts({ page, limit, tagSlug });
    
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}
