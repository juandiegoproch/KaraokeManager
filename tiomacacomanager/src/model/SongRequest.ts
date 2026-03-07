export interface SongRequest{
    request_time: string,
    sender: string,
    songname: string,
    vid_url: string,
    song_thumbnail: string
    requestid?: string,
}

export function getDefaultSongRequest(): SongRequest {
    return {
    request_time: "",
    sender: "",
    songname: "",
    vid_url: "",
    song_thumbnail:""
  }
}