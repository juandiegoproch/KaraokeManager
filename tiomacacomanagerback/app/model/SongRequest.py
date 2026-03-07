from typing import Optional
from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, HttpUrl

class SongRequest(BaseModel):
    request_time: datetime
    sender: str
    songname: str
    vid_url: HttpUrl
    song_thumbnail: HttpUrl
    requestid: Optional[UUID] = None

    #jsonification params
    model_config = {
        "json_encoders": {
            HttpUrl: str,
            UUID: str,
            datetime: lambda dt: dt.isoformat()
        }
    }