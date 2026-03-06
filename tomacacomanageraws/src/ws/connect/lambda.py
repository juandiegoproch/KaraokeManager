# learn more about WebSocket functions here: https://arc.codes/ws
import arc
def handler(event, context):
    conId = event.get("requestContext").get("connectionId")
    conns = arc.tables.table("queueupdatees-connections")
    conns.put_item(Item={"pk":conId})
    return {'statusCode': 200}