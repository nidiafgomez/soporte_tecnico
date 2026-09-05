export function isAuthenticatedSSR(
    cookies: { get: (key: string) => { value: string } | undefined },
): boolean {
    return !!cookies.get("jwt_token")?.value;
}

export function getTokenSRR(
    cookies: { get: (key: string) => { value: string } | undefined },
): string | null {
    return cookies.get("jwt_token")?.value ?? null;
}
