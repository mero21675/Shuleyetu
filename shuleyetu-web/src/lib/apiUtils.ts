import { NextRequest, NextResponse } from "next/server";

type JsonInit = { status?: number; headers?: HeadersInit };

type JsonErrorBody = { error: string } & Record<string, unknown>;

type JsonSuccessBody = Record<string, unknown>;

export async function readJsonBody<T>(request: NextRequest): Promise<T | null> {
  try {
    const parsed = (await request.json().catch(() => null)) as T | null;
    return parsed;
  } catch {
    return null;
  }
}

export function jsonError(
  error: string,
  status = 500,
  extra?: Record<string, unknown>,
): NextResponse<JsonErrorBody> {
  return NextResponse.json({ error, ...(extra ?? {}) }, { status });
}

export function jsonOk<T extends JsonSuccessBody>(
  body: T,
  init?: JsonInit,
): NextResponse<T> {
  return NextResponse.json(body, init);
}
