export function titleCase(str) {
  return str
    .toLowerCase()
    .replace(/([^\p{L}\p{N}]|^)(\p{L})/gu, (match, sep, char) => {
      return sep + char.toUpperCase();
    });
}
