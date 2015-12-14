#!/bin/bash
# Create a JSON of mapgame stats
echo "{" > stats.json
ID=27
SQL="SELECT CONCAT(guess, ',', lat, ',', lon) FROM guesses WHERE games_id = $ID;"
echo $SQL > stats.sql
mysql mapgame -u root -p < results.sql >> results.tmp
echo "}" > stats.json
sed '2d' results.tmp >> results.csv
