#!/bin/bash
echo "Importing data into MongoDB"
mongoimport --host localhost --db symmetrical-couscous --collection geolocData --type tsv --file /docker-entrypoint-initdb.d/dataset.tsv --headerline