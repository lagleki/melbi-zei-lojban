#!/bin/bash

docker kill snanu ; docker rm snanu

docker run \
  -d \
  -it \
  --name snanu \
  --memory 5g \
  -v $(pwd)/project:/snanu/project/:Z \
  -p 3045:3000 \
  snanu
