export function formatOrdinal(num: number): string {
    const suffixes = ["th", "st", "nd", "rd"];
    const remainder = num % 100;
    return `${num}${suffixes[(remainder - 20) % 10] || suffixes[remainder] || suffixes[0]}`;
}

export function formatName(name: string) {
    return name.length > 8 ? name.slice(0, 7) + "..." : name;
}