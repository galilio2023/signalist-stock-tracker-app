import { NextRequest } from "next/server";
import { connectToDatabase } from "@/database/mongoose";

export async function GET(_req: NextRequest) {
  const startedAt = Date.now();
  try {
    const conn = await connectToDatabase();
    // Mongoose connection states: 1 = connected
    const state = conn.connection.readyState;
    const ms = Date.now() - startedAt;
    return new Response(JSON.stringify({ ok: true, state, elapsedMs: ms }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (err: any) {
    const ms = Date.now() - startedAt;
    return new Response(
      JSON.stringify({
        ok: false,
        error: err?.message ?? String(err),
        elapsedMs: ms,
      }),
      { status: 500, headers: { "content-type": "application/json" } },
    );
  }
}
