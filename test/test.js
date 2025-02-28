const ytdl = require("ytdl-core");

(async () => {
  try {
    console.log("🔍 Buscando informações do primeiro vídeo da playlist...");

    const videoInfo = await ytdl.getInfo("https://www.youtube.com/watch?v=RBUfklQLPAg&list=PLlBX9acexuWhKVTEayaAB9J6dsoNycjFJ&index=1");
    
    console.log("🎵 Vídeo encontrado:", videoInfo.videoDetails.title);
  } catch (error) {
    console.error("❌ Erro ao obter informações do vídeo:", error);
  }
})();
