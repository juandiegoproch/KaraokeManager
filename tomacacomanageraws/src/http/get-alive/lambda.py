# learn more about HTTP functions here: https://arc.codes/http
from vendor.shared.error_handler import error_handler

@error_handler
def handler(req, context):
    a = 0/0
    return {"message": "hello world"}