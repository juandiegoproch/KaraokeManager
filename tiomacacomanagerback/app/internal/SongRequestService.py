from typing import List, Optional

from app.model.SongRequest import SongRequest
import uuid
import os
from pymongo import MongoClient

#service config
_COLLECTION = "songrequests"
_DB_CONNECTION: Optional[MongoClient] = None
_DB_NAME = os.getenv("DATABASE_NAME")

# service functions  
def _getDbConnection():
    global _DB_CONNECTION
    if (_DB_CONNECTION is None):
        try:
            url = os.getenv("DATABASE_URL")
            _DB_CONNECTION = MongoClient(url)
        except Exception as e:
            raise Exception("Error getting connection to database: ", e)
    return _DB_CONNECTION

def _cleanupService():
    _DB_CONNECTION.close()

def createNewSongRequest(sr: SongRequest) -> SongRequest:
    song_uuid = uuid.uuid4()
    sr.requestid = song_uuid
    try:
        db = _getDbConnection().get_database(_DB_NAME)
        songrequests = db.get_collection(_COLLECTION)
        res = songrequests.insert_one(sr.model_dump(mode="json"))
    except Exception as e:
        print(e)
        raise Exception("Error inserting to database:",e)
    return sr

def getAllSongRequests() -> List[SongRequest]:
    res = None
    try:
        db = _getDbConnection().get_database(_DB_NAME)
        songrequests = db.get_collection(_COLLECTION)
        res = songrequests.find()
    except Exception as e:
        print(e)
        raise Exception("Error fetching from database:",e)
    song_requests = [SongRequest(**sr) for sr in res]
    return song_requests
    

