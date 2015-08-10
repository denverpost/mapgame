#!/bin/bash
# Create a CSV of mapgame results
echo "distance,lat,lon" > results.tmp
mysql mapgame -u root -p < results.sql >> results.tmp
sed '2d' results.tmp >> results.csv
