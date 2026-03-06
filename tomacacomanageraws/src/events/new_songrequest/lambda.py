# learn more about event functions here: https://arc.codes/events
import arc
import arc
import json

def handler(event, context):
    conns = arc.tables.table("queueupdatees-connections")
    resp = conns.scan()
    connids = [i.get("pk") for i in resp.get("Items", [])]
    
    # 1. Get the raw message from SNS
    raw_message = event.get("Records")[0].get("Sns").get("Message")
    
    # 2. Safety Check: If it's already a stringified JSON, 
    # we want to ensure it's "clean" before sending.
    # If arc.ws.send receives a dict, it often stringifies it for you.
    try:
        payload = json.loads(raw_message)
    except:
        print("Exception ocurred while parsing data")
        return False

    print(f"Sending payload: {payload} to {connids}")

    for connid in connids:
        arc.ws.send(id=connid, payload=payload)
        
    return True