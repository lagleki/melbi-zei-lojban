FROM alpine:latest

RUN apk add --no-cache bash
RUN apk add --update nodejs npm yarn
# ENV PYTHONUNBUFFERED=1
# RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python
# RUN python3 -m ensurepip
# RUN pip3 install --no-cache --upgrade pip setuptools
# RUN apk add --no-cache make gcc g++
# COPY project/package*.json /snanu/
WORKDIR /snanu
# RUN yarn ; npm i -g npm-check-updates

# CMD npm start