#!/bin/bash
docker build -t snanu .

docker kill snanu ; docker rm snanu

docker run \
  -d \
  -it \
  --name snanu \
  --memory 5g \
  -v $(pwd)/project:/snanu/project/:Z \
  -p 3045:3000 \
  snanu
docker exec -it snanu bash -c "cd /snanu/project"