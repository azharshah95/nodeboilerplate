# download image
FROM alpine:latest

# upgrade and update
RUN apk update && apk upgrade

# install bash shell
RUN apk add bash
RUN bash && echo bash installed

# install Git Source Control
RUN apk add git

# check Git source control version
RUN git --version

# install nodejs and npm
RUN apk add nodejs npm

# create directory
RUN cd usr
RUN mkdir -p src/app
RUN pwd

WORKDIR /usr/src/app

COPY package*.json ./

COPY . .

RUN npm install

# --- development

# ENV PORT 5000

# EXPOSE ${PORT}

# CMD [ "node", "server.js" ]

# --- development