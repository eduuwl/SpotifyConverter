declare module 'youtube-playlist'{
    interface PlaylistItem {
      title: string;
      id: string;
    }
  
    interface GetPlaylistOptions {
      limit?: number; 
    }
  
    function getPlaylist(
      url: string,
      options?: GetPlaylistOptions
    ): Promise<PlaylistItem[]>;
  
    export { getPlaylist };
  }
  