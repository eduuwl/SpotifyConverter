import { google } from "googleapis";

function extractPlaylistId(urlOrId: string): string | null {
  const match = urlOrId.match(/[?&]list=([^&]+)/);
  return match ? match[1] : urlOrId;
}

function getYouTubeClient() {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) throw new Error("YOUTUBE_API_KEY ausente no .env");
  return { yt: google.youtube({ version: "v3", auth: key }), key };
}

interface YTTrack {
  videoId: string;
  rawTitle: string;
  channelTitle: string;
  durationSec: number | null;
}

function parseISODurationToSec(duration: string | null): number | null {
  if (!duration) return null;
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return null;
  const hours = parseInt(match[1] || "0", 10);
  const minutes = parseInt(match[2] || "0", 10);
  const seconds = parseInt(match[3] || "0", 10);
  return hours * 3600 + minutes * 60 + seconds;
}

export async function getYouTubePlaylist(playlistUrlOrId: string) {
  const { yt, key } = getYouTubeClient();

  const playlistId = extractPlaylistId(playlistUrlOrId);
  if (!playlistId) throw new Error("Playlist ID inválido.");

  // 1) título da playlist
  const pl = await yt.playlists.list({
    part: ["snippet"],
    id: [playlistId],
    key, 
  });
  const playlistTitle = pl.data.items?.[0]?.snippet?.title ?? "Playlist";

  // 2) pagina os items p/ juntar ids
  let pageToken: string | undefined = undefined;
  const videoIds: string[] = [];

  do {
    const res = await yt.playlistItems.list({
      part: ["contentDetails"],
      playlistId,
      maxResults: 50,
      pageToken,
      key, 
    });
    const ids = (res.data.items || [])
      .map(i => i.contentDetails?.videoId)
      .filter((v): v is string => Boolean(v));
    videoIds.push(...ids);
    pageToken = res.data.nextPageToken || undefined;
  } while (pageToken);

  // 3) busca dados dos vídeos em lotes
  const items: YTTrack[] = [];
  for (let i = 0; i < videoIds.length; i += 50) {
    const batch = videoIds.slice(i, i + 50);
    const vids = await yt.videos.list({
      part: ["snippet", "contentDetails"],
      id: batch,
      maxResults: 50,
      key,
    });

    for (const v of vids.data.items || []) {
      items.push({
        videoId: v.id!,
        rawTitle: v.snippet?.title ?? "",
        channelTitle: v.snippet?.channelTitle ?? "",
        durationSec: parseISODurationToSec(v.contentDetails?.duration ?? null),
      });
    }
  }

  return { playlistId, playlistTitle, items };
}
