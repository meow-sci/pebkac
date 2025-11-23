export function isTrueString(o: string | undefined | null): boolean {
  if (typeof o === "string" && o.toLowerCase() === "true") {
    return true;
  }
  return false;
}