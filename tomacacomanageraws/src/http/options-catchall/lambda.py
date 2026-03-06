# learn more about HTTP functions here: https://arc.codes/http
def handler(req, context):
  return {
      "statusCode": 200,
      "headers": {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*", # Change to your domain in production
          "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization"
      },
      "body": "{\"message\": \"Success!\"}"
  }