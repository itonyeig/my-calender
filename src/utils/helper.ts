export function generateUniqueId(): string {
    return crypto.getRandomValues(new Uint32Array(1))[0].toString(16)
}