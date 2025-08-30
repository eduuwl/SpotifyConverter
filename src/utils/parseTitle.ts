export function normalizeTitle(title: string) {
  return title
    .replace(/\s*\[[^\]]+\]/g, "")
    .replace(/\s*\([^)]+\)/g, "")
    .replace(/\bfeat\.?|\bft\.?/gi, "")
    .replace(/official|video|lyrics?|audio|mv/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export function parseArtistTrack(rawTitle: string) {
  const cleaned = normalizeTitle(rawTitle);
  const split = cleaned.split(" - ");
  if (split.length >= 2) {
    const artist = split[0].trim();
    const track = split.slice(1).join(" - ").trim();
    return { artist, track, query: `${artist} ${track}` };
  }
  return { artist: "", track: cleaned, query: cleaned };
}
