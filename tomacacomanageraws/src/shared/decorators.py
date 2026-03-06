# last resors error handler
from dataclasses import fields
from functools import wraps
import json

def error_handler(lambda_handler):
    @wraps(lambda_handler)
    def wrapper(req,context):
        try:
            return lambda_handler(req,context)
        except:
            return {
                "error":500,
                "message":"Unspecified error"
                }
    return wrapper

def parse_to(dto_class):
    #MUST RETURN VALID DECORATOR
    def decorator(funct: callable):
        #MUST CREATE A WRAPPER AS DECORATOR
        @wraps(funct)
        def wrapper(req,context):
            body_str = req.get("body")
            if (body_str is None):
                return {
                    "error": 400,
                    "message": "No body"
                }
            try:
                loaded = json.loads(body_str)
            except:
                return {
                    "error": 400,
                    "message": "malformed json"
                }
            return funct(req,context,loaded)
        return wrapper
    return decorator

def json_result(funct):
    @wraps(funct)
    def wrapper(req, context):
        res = funct(req,context)
        return json.dumps(res.asdict())