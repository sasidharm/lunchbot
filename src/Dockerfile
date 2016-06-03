FROM ubuntu:14.04

ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update
RUN apt-get -qq update
RUN apt-get install -y wget
RUN wget -qO- https://deb.nodesource.com/setup_4.x | sudo bash -
RUN apt-get install -y nodejs

COPY . /src

RUN cd /src; npm install

EXPOSE  8080

CMD ["nodejs", "/src/lunch_bot.js"]
