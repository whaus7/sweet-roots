export function googleImagesUrl(varietyName: string, commonName: string): string {
  const query = `${varietyName} ${commonName}`;
  return `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(query)}`;
}
