export function isNotEmptyString(o: string | undefined | null): o is string {
  if (typeof o === "string" && o.trim() !== "") {
    return true;
  }
  return false;
}
