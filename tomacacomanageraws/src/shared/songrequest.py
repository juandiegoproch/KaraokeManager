from dataclasses import dataclass
from datetime import datetime
@dataclass
class SongRequest:
    request_time: str
    sender: str
    songname: str
    vid_url: str
    song_thumbnail: str
    requestid: str = ""