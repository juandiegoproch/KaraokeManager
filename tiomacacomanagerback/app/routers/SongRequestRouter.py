
from typing import List

from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect
from app.model.SongRequest import SongRequest
from app.internal.SongRequestService import createNewSongRequest, getAllSongRequests
from app.internal.WebsocketManager import wsmanager
import asyncio

router = APIRouter(
    prefix="/song_request",
    tags=["song_request"],
    )

@router.post("")
async def newSongRequestRouter(sr: SongRequest,) -> SongRequest:
    sr = createNewSongRequest(sr)
    asyncio.create_task(wsmanager.broadcast(sr))
    return sr

@router.get("")
async def getSongRequestsRouter() -> List[SongRequest]:
    return getAllSongRequests()

@router.websocket("")
async def websocket_endpoint(ws: WebSocket):
    await wsmanager.connect(ws)

    try:
        while True:
            data = await ws.receive_json()
            wsmanager.onmessage(ws,data)
    except WebSocketDisconnect:
        wsmanager.disconnect(ws)