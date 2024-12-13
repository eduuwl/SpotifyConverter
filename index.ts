import * as readline from "readline";
import { getYouTubePlaylistTitles } from "./src/youtube";
import { authenticateSpotify, searchAndAddTracksToPlaylist } from "./src/spotify";
import { getPlaylist } from "youtube-playlist";
import dotenv from "dotenv";

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Digite a URL da playlist do YouTube: ", async (playlistUrl) => {
  try {
    console.log("Obtendo títulos da playlist do YouTube...");
    const youtubeTracks = await getYouTubePlaylistTitles(playlistUrl);

    console.log("Autenticando no Spotify...");
    await authenticateSpotify();

    console.log("Criando playlist no Spotify...");
    const userId = process.env.SEU_CLIENT_ID!; 
    await searchAndAddTracksToPlaylist(userId, "Playlist Convertida", youtubeTracks);

    console.log("Playlist criada com sucesso!");
  } catch (error: any) {
    console.error("Erro:", error.message);
  } finally {
    rl.close();
  }
});
