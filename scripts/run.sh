#!/bin/sh

server=http://localhost:5000/api

curl -X GET $server/gps

curl -X POST $server/gps -d '{"gps":"4000" }' -H 'content-type:application/json'
