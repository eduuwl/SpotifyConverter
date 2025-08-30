import dotenv from "dotenv";
import * as readline from "readline";
import { getYouTubePlaylist } from "./src/youtube";
import { getSpotifyAuthUrl, authenticateSpotify, searchAndAddTracksToPlaylist } from "./src/spotify";

dotenv.config();
console.log("TA SETADA SIM OU NAO?", !!process.env.YOUTUBE_API_KEY);

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function extractCode(input: string): string {
  try {
    if (input.includes("http")) {
      const u = new URL(input.trim());
      const code = u.searchParams.get("code");
      if (!code) throw new Error("Código não encontrado na URL.");
      return code;
    }
    return input.trim();
  } catch {
    return input.trim();
  }
}

async function ask(q: string): Promise<string> {
  return new Promise((res) => rl.question(q, (ans) => res(ans.trim())));
}

(async () => {
  try {
    // 1) Auth Spotify
    const authUrl = getSpotifyAuthUrl(); 
    console.log("\n Abra este link no navegador para autorizar o Spotify:");
    console.log(authUrl);

    const authCode = extractCode(await ask("\n Cole o CÓDIGO ou a URL completa de callback do Spotify: "));
    console.log("🔄 Autenticando no Spotify...");
    await authenticateSpotify(authCode);
    console.log("✅ Autenticado!");

    // 2) URL da playlist
    const playlistUrl = await ask("\n URL da playlist do YouTube: ");
    console.log("🔍 Buscando dados da playlist…");

    // tenta pegar título + itens (API nova); se algo falhar, cai pro modo só detítulos
    let defaultName = "Playlist Convertida";
    let titles: string[] = [];
    try {
      const yt = await getYouTubePlaylist(playlistUrl);
      defaultName = yt.playlistTitle || defaultName;
      titles = yt.items.map(i => i.rawTitle);
    } catch {
      titles = (await getYouTubePlaylist(playlistUrl)).items.map(i => i.rawTitle);
    }

    if (!titles.length) throw new Error("A playlist do YouTube não tem itens.");

    const customName = await ask(`\n Nome da playlist no Spotify (ENTER para usar “${defaultName}”): `);
    const finalName = customName || defaultName;

    const userId = process.env.SPOTIFY_USER_ID || "";
    console.log(`🎵 Criando “${finalName}” com ${titles.length} faixas…`);
    await searchAndAddTracksToPlaylist(userId, finalName, titles);

    console.log("✅ Playlist criada com sucesso no Spotify!");
  } catch (err: any) {
    console.error("❌ Erro:", err?.message || err);
  } finally {
    rl.close();
  }
})();
