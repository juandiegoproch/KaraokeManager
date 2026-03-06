# learn more about HTTP functions here: https://arc.codes/http
from vendor.shared.decorators import error_handler, parse_to
from vendor.shared.songrequest import SongRequest
import arc.tables
import uuid
from datetime import date, datetime
from dataclasses import asdict
import json

#@error_handler
@parse_to(SongRequest)
def handler(req, context,r):
    print("RUNNING POST song_request")

    sender = r.get("sender")
    songname = r.get("songname")
    vidurl = r.get("vid_url")
    thumbnail = r.get("song_thumbnail")
    sent_time = r.get("request_time")
    try:
        datetime.fromisoformat(sent_time)
    except:
        return {
            "code":400,
            "message":"sent_time invalid format"
        }
    id = str(uuid.uuid4())

    songreq = SongRequest(sent_time, sender,songname,vidurl,thumbnail,id)

    sreq_table = arc.tables.table("songrequests")
    sreq_table.put_item(Item=asdict(songreq))
    arc.events.publish("new_songrequest",asdict(songreq))
    return arc.http.res(req, {
                "statusCode": 200,
                "json": asdict(songreq), # 'json' key automatically stringifies and sets content-type
                "cors": True     # This tells Arc to mirror the 'Origin' header back
            })