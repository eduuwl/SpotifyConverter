import YouTubePlaylist from 'youtube-playlist';

/**
 * Obtém os títulos de vídeos de uma playlist do YouTube.
 * @param playlistUrl URL da playlist do YouTube
 * @returns Um array de títulos de vídeos
 */

export async function getYouTubePlaylistTitles(playlistUrl: string): Promise<string[]> {
  try {
    const playlist = await YouTubePlaylist.getPlaylist(playlistUrl, { limit: 50 });
    
    if (!Array.isArray(playlist)) {
      throw new Error("A playlist retornada não é um array válido.");
    }
    
    console.log("Playlist retornada:", playlist);

    return playlist.map((item: { title: string; id: string }) => item.title);
  } catch (error: any) {
    console.error("Erro ao obter a playlist do YouTube:", error.message);
    throw error;
  }
}
