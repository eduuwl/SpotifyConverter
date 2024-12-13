const { getPlaylist } = require('youtube-playlist');

/**
 * Obtém os títulos de vídeos de uma playlist do YouTube.
 * @param playlistUrl URL da playlist do YouTube
 * @returns Um array de títulos de vídeos
 */

export async function getYouTubePlaylistTitles(playlistUrl: string): Promise<string[]> {
  try {
    const playlist = await getPlaylist(playlistUrl, "name");
    return playlist.items.map((item: any) => item.name);
  } catch (error: any) {
    console.error("Erro ao obter a playlist do YouTube:", error.message);
    throw error;
  }
}
