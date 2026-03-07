from typing import List

from fastapi import WebSocket
from pydantic import BaseModel

class WebSocketManager:
    def __init__(self):
        self.connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.connections.remove(websocket)
    
    def onmessage(self,ws: WebSocket,message:dict):
        print(message)
        pass

    async def broadcast(self, message: BaseModel):
        payload = message.model_dump(mode="json")

        for ws in self.connections:
            await ws.send_json(payload)

wsmanager = WebSocketManager()