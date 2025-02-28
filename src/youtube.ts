const getPlaylist = require("yt-playlist-scraper");

/**
 * Obtém os títulos de vídeos de uma playlist do YouTube.
 * @param playlistUrl URL da playlist do YouTube
 * @returns Um array de títulos de vídeos
 */
export async function getYouTubePlaylistTitles(playlistUrl: string): Promise<string[]> {
  try {
    console.log("🔍 Buscando vídeos da playlist...");

    const playlistData = await getPlaylist(playlistUrl);

    if (!playlistData || !playlistData.items || playlistData.items.length === 0) {
      throw new Error("A playlist retornada não contém vídeos.");
    }

    console.log(`✅ Playlist encontrada: ${playlistData.title}`);
    
    return playlistData.items.map((item: { title: string }) => item.title);
  } catch (error: any) {
    console.error("❌ Erro ao obter a playlist do YouTube:", error.message);
    throw error;
  }
}
