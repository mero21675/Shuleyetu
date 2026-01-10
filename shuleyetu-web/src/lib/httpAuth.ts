export function parseBearerToken(authorizationHeader: string | null): string {
  if (!authorizationHeader) return "";
  const match = authorizationHeader.match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim() ?? "";
}
