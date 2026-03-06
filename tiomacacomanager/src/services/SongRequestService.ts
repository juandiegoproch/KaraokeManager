import type { SongRequest } from "../model/SongRequest"


export class SongRequestService{
    private readonly api_base: string = "http://192.168.1.69:3333"
    private readonly ws_host: string = "ws://192.168.1.69:3333"

    private webSocket: WebSocket | null = null;

    private eventHandlers: { new_song: null | ((song: SongRequest) => void) } = {
    new_song: null, // starts null
    };

    new_song_request(req:SongRequest) {
        console.log("Sending request:", req);
        const endpoint = `${this.api_base}/song_request`;
        const now = new Date().toISOString();
            
            const payload = {
                ...req,
                request_time: now
            };
        return fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        })
    }

    get_song_requests():Promise<Array<SongRequest>> {
        console.log("Fetching songRequests:");
        const endpoint = `${this.api_base}/song_request`;
        return fetch(endpoint, {
            method:"GET",
            headers: {
                "Content-Type": "application/json",
            },
            //body:JSON.stringify({})
        }).then((e) => e.json()).then(
            (e) => e as Array<SongRequest>
        )
    }

    onNewSongRequest( fn: (a: SongRequest) => void){
        this.eventHandlers.new_song = fn;
    }

    onMessage(ev: MessageEvent){
        debugger
        console.log("Message recieved at ws:")
        console.log(ev.data)
        const msg_raw = JSON.parse(ev.data);
        console.log(msg_raw)
        const msg = msg_raw as SongRequest
        console.log(msg)
        this.eventHandlers.new_song?.(msg)
    }   

    startWebSocket(){
        if (this.webSocket === null || this.webSocket?.readyState == WebSocket.CLOSED){
            this.webSocket = new WebSocket(this.ws_host)
            this.webSocket.onopen = () => console.log("Connected to ws")
            this.webSocket.onmessage = this.onMessage.bind(this);
            this.webSocket.onclose = () => console.log("Disconnected from ws")
            this.webSocket.onerror = () => console.error("ERROR IN WS")
        }
        else
            console.warn("Found existing open ws");
    }

    stopWebSocket(){
        if (this.webSocket === null) throw Error("Uninitialized or dead websocket attempted closing")
        this.webSocket.close();
        this.webSocket = null;
    }
}