import { NextResponse } from "next/server";

export const runtime = 'edge';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const url = searchParams.get("url");

        if (!url) {
            return NextResponse.json({ error: "No URL provided" }, { status: 400 });
        }

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.statusText}`);
        }

        const buffer = await response.arrayBuffer();

        // Headers for CORS and caching
        const headers = new Headers();
        headers.set("Content-Type", response.headers.get("Content-Type") || "image/png");
        headers.set("Cache-Control", "public, max-age=86400");
        headers.set("Access-Control-Allow-Origin", "*");

        return new NextResponse(buffer, {
            status: 200,
            headers
        });

    } catch (error) {
        console.error("Image proxy error:", error);
        return NextResponse.json({ error: "Failed to proxy image" }, { status: 500 });
    }
}
