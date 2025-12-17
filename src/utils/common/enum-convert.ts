export function convertEnumOrString(value: any): string {
  if (!value) return "";

  const str = value.toString().trim();

  if (/^[A-Z0-9_]+$/.test(str)) {
    return str
      .split("_")
      .map(
        (word: string) =>
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      )
      .join(" ");
  } else {
    return str
      .split(/\s+/)
      .map((word: string) => word.toUpperCase())
      .join("_");
  }
}
