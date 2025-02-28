import * as readline from "readline";
import dotenv from "dotenv";
import { getYouTubePlaylistTitles } from "./src/youtube";
import { getSpotifyAuthUrl, authenticateSpotify, searchAndAddTracksToPlaylist } from "./src/spotify";

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Passo 1: Mostrar link para login no Spotify
console.log("\n🚀 Abra este link no navegador para autorizar o Spotify:");
console.log(getSpotifyAuthUrl());

rl.question("\n🔑 Cole aqui o código de autenticação da URL do Spotify: ", async (authCode) => {
  try {
    console.log("🔄 Autenticando no Spotify...");
    await authenticateSpotify(authCode);

    rl.question("\n📥 Digite a URL da playlist do YouTube: ", async (playlistUrl) => {
      try {
        console.log("🔍 Obtendo títulos da playlist do YouTube...");
        const youtubeTracks = await getYouTubePlaylistTitles(playlistUrl);

        console.log("🎵 Criando playlist no Spotify...");
        const userId = process.env.SEU_USER_ID!;
        await searchAndAddTracksToPlaylist(userId, "Playlist Convertida", youtubeTracks);

        console.log("✅ Playlist criada com sucesso no Spotify!");
      } catch (error: any) {
        console.error("❌ Erro ao processar a playlist:", error.message);
      } finally {
        rl.close();
      }
    });
  } catch (error: any) {
    console.error("❌ Erro na autenticação do Spotify:", error.message);
    rl.close();
  }
});
