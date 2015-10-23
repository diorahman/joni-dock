FROM debian:jessie
MAINTAINER Dhi Aurrahman

RUN echo "deb http://kambing.ui.ac.id/debian/ jessie main" > /etc/apt/sources.list
RUN apt update
RUN apt install -y g++
RUN mkdir /src
WORKDIR /src

