# learn more about HTTP functions here: https://arc.codes/http
from vendor.shared.decorators import error_handler, parse_to
from vendor.shared.songrequest import SongRequest
import arc.tables
import uuid
from dataclasses import asdict
import json

def handler(req, context):
    # Get the table and scan
    tab = arc.tables.table("songrequests")
    items = tab.scan().get("Items", [])
    
    # Sort DESC by request_time (ISO strings sort perfectly)
    items.sort(key=lambda x: x.get("request_time", ""), reverse=True)
    
    # Use arc's response helper
    # 'json' automatically stringifies the list
    # 'cors' automatically mirrors the Origin and sets headers
    return arc.http.res(req, {
        "json": items,
        "cors": True
    })