"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateSpotify = authenticateSpotify;
exports.searchAndAddTracksToPlaylist = searchAndAddTracksToPlaylist;
const spotify_web_api_node_1 = __importDefault(require("spotify-web-api-node"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const spotifyApi = new spotify_web_api_node_1.default({
    clientId: process.env.SEU_CLIENT_ID,
    clientSecret: process.env.SEU_CLIENT_SECRET,
    redirectUri: process.env.SEU_REDIRECT_URI,
});
function authenticateSpotify() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield spotifyApi.clientCredentialsGrant();
            spotifyApi.setAccessToken(data.body.access_token);
            console.log("Spotify autenticado com sucesso!");
        }
        catch (error) {
            console.error("Erro ao autenticar no Spotify:", error.message);
            throw error;
        }
    });
}
/**
 * Busca músicas no Spotify e adiciona à playlist.
 * @param userId ID do usuário do Spotify
 * @param playlistName Nome da nova playlist
 * @param trackNames Array de títulos de músicas
 */
function searchAndAddTracksToPlaylist(userId, playlistName, trackNames) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const playlist = yield spotifyApi.createPlaylist(playlistName, {
                public: false,
            });
            const trackUris = [];
            for (const trackName of trackNames) {
                const searchResult = yield spotifyApi.searchTracks(trackName);
                if ((_a = searchResult.body.tracks) === null || _a === void 0 ? void 0 : _a.items.length) {
                    trackUris.push(searchResult.body.tracks.items[0].uri);
                }
                else {
                    console.warn(`Música não encontrada no Spotify: ${trackName}`);
                }
            }
            if (trackUris.length) {
                yield spotifyApi.addTracksToPlaylist(playlist.body.id, trackUris);
                console.log(`Adicionadas ${trackUris.length} músicas à playlist.`);
            }
            else {
                console.log("Nenhuma música foi encontrada para adicionar.");
            }
        }
        catch (error) {
            console.error("Erro ao criar ou adicionar músicas à playlist:", error.message);
            throw error;
        }
    });
}
