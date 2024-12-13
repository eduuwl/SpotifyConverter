"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getYouTubePlaylistTitles = getYouTubePlaylistTitles;
const youtube_playlist_1 = require("youtube-playlist");
/**
 * Obtém os títulos de vídeos de uma playlist do YouTube.
 * @param playlistUrl URL da playlist do YouTube
 * @returns Um array de títulos de vídeos
 */
function getYouTubePlaylistTitles(playlistUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const playlist = yield (0, youtube_playlist_1.getPlaylist)(playlistUrl, "name");
            return playlist.items.map((item) => item.name);
        }
        catch (error) {
            console.error("Erro ao obter a playlist do YouTube:", error.message);
            throw error;
        }
    });
}
