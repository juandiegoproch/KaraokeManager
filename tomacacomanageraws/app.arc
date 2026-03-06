@app
tio-macaco-aws

@aws
runtime python3.11  # Use whatever python version you have installed
region us-east-1

@http
post /song_request
options /*
get  /song_request
get /alive

@ws 
queueupdatees

@tables 
songrequests
  requestid *String
queueupdatees-connections
  pk *String

@events
new_songrequest

@shared