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
const readline = __importStar(require("readline"));
const youtube_1 = require("./src/youtube");
const spotify_1 = require("./src/spotify");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
rl.question("Digite a URL da playlist do YouTube: ", (playlistUrl) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Obtendo títulos da playlist do YouTube...");
        const youtubeTracks = yield (0, youtube_1.getYouTubePlaylistTitles)(playlistUrl);
        console.log("Autenticando no Spotify...");
        yield (0, spotify_1.authenticateSpotify)();
        console.log("Criando playlist no Spotify...");
        const userId = process.env.SEU_CLIENT_ID;
        yield (0, spotify_1.searchAndAddTracksToPlaylist)(userId, "Playlist Convertida", youtubeTracks);
        console.log("Playlist criada com sucesso!");
    }
    catch (error) {
        console.error("Erro:", error.message);
    }
    finally {
        rl.close();
    }
}));
