
from typing import List

from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect, status
from app.model.SongRequest import SongRequest
from app.internal.SongRequestService import createNewSongRequest, getAllSongRequests, deleteSongRequestById
from app.internal.WebsocketManager import wsmanager
import asyncio

router = APIRouter(
    prefix="/song_request",
    tags=["song_request"],
    )

@router.post("",status_code=status.HTTP_201_CREATED)
async def newSongRequestRouter(sr: SongRequest,) -> SongRequest:
    sr = createNewSongRequest(sr)
    asyncio.create_task(wsmanager.broadcast(sr))
    return sr

@router.delete("/{to_delete_uuid}",status_code=status.HTTP_204_NO_CONTENT)
async def deleteSongRequestRouter(to_delete_uuid):
    sr = deleteSongRequestById(to_delete_uuid)
    return sr

@router.get("",status_code=status.HTTP_200_OK)
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