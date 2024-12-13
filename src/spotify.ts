import SpotifyWebApi from "spotify-web-api-node";
import * as dotenv from "dotenv";

dotenv.config();

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SEU_CLIENT_ID,
  clientSecret: process.env.SEU_CLIENT_SECRET,
  redirectUri: process.env.SEU_REDIRECT_URI,
});

export async function authenticateSpotify(): Promise<void> {
  try {
    const data = await spotifyApi.clientCredentialsGrant();
    spotifyApi.setAccessToken(data.body.access_token);
    console.log("Spotify autenticado com sucesso!");
  } catch (error: any) {
    console.error("Erro ao autenticar no Spotify:", error.message);
    throw error;
  }
}

/**
 * Busca músicas no Spotify e adiciona à playlist.
 * @param userId ID do usuário do Spotify
 * @param playlistName Nome da nova playlist
 * @param trackNames Array de títulos de músicas
 */


export async function searchAndAddTracksToPlaylist(
    userId: string,
    playlistName: string,
    trackNames: string[]
  ): Promise<void> {
    try {
      const playlist = await spotifyApi.createPlaylist(playlistName, {
        public: false,
      });
  
      const trackUris: string[] = [];
  
      for (const trackName of trackNames) {
        const searchResult = await spotifyApi.searchTracks(trackName);
        if (searchResult.body.tracks?.items.length) {
          trackUris.push(searchResult.body.tracks.items[0].uri);
        } else {
          console.warn(`Música não encontrada no Spotify: ${trackName}`);
        }
      }
  
      if (trackUris.length) {
        await spotifyApi.addTracksToPlaylist(playlist.body.id, trackUris);
        console.log(`Adicionadas ${trackUris.length} músicas à playlist.`);
      } else {
        console.log("Nenhuma música foi encontrada para adicionar.");
      }
    } catch (error: any) {
      console.error("Erro ao criar ou adicionar músicas à playlist:", error.message);
      throw error;
    }
  }
