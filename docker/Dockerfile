FROM node:6.10
# FROM node:6.10-alpine
# FROM gliderlabs/alpine:3.4
LABEL name="bbq-arduino"
LABEL author="mdwagner"
LABEL repo="https://github.com/mdwagner/bbq-arduino"

ENV ANDROID_HOME=/opt/android-sdk-linux \
    IONIC_VERSION=2.2.0 \
    CORDOVA_VERSION=6.4.0 \
    PROJECT_PATH=/project/bbq-arduino-ionic \
    GIT_BRANCH=develop

# Install basic packages
RUN apt-get update && \
    apt-get install -y git wget curl unzip build-essential tar --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*
# RUN apk-install nodejs

# Install Nodejs
# RUN curl --retry 3 -SLO "http://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-linux-x64.tar.gz" && \
#     tar -xzf "node-v$NODE_VERSION-linux-x64.tar.gz" -C /usr/local --strip-components=1 && \
#     rm "node-v$NODE_VERSION-linux-x64.tar.gz"

# Install NPM, Cordova, Ionic
RUN npm install -g cordova@"$CORDOVA_VERSION"
RUN npm install -g ionic@"$IONIC_VERSION"
RUN npm cache clear

# Install Java JDK
RUN apt-get update && \
    apt-get install -y default-jdk --no-install-recommends

# Instal Android SDK
RUN ANDROID_HOME="${ANDROID_HOME}" >> /etc/environment && \
    # mkdir /opt && \
    cd /opt && \
    wget --output-document=android-sdk.tgz --quiet http://dl.google.com/android/android-sdk_r24.4.1-linux.tgz && \
    tar -xzf android-sdk.tgz && \
    rm -f android-sdk.tgz && \
    chown -R root. /opt

# Set Path
ENV PATH ${PATH}:${ANDROID_HOME}/tools:${ANDROID_HOME}/platform-tools:/opt/tools

# Install Android SDK Elements
COPY sh /opt/tools
RUN ["sudo /opt/tools/android-accept-licenses.sh", "android update sdk --all --no-ui --filter platform-tools,tools,build-tools-24.0.2,android-24,android-23,android-22,android-19,android-21,extra-android-support,extra-android-m2repository,extra-google-m2repository"]
RUN unzip ${ANDROID_HOME}/temp/*.zip -d ${ANDROID_HOME}
# RUN apk --no-cache add git
# RUN apt-get update && apt-get install -y git --no-install-recommends NEED TO REMOVE PACKAGES AFTER INSTALL
RUN git clone https://github.com/mdwagner/bbq-arduino-ionic.git $PROJECT_PATH
RUN chown -R $(whoami) $PROJECT_PATH
# RUN apk-install python

WORKDIR $PROJECT_PATH
# USER bbq
ENV HOME=$PROJECT_PATH
RUN mkdir node_modules
ENTRYPOINT git fetch && \
    git checkout $GIT_BRANCH && \
    git pull && \
    cordova telemetry on && \
    # node -v && npm -v && pwd && ls -la && ionic info && \
    npm install && \
    # npm rebuild node-sass && \
    ionic serve -b -p 8100

# CMD ["ionic", "serve"]

# ONBUILD ENV HOME $PROJECT_PATH

EXPOSE 8100
EXPOSE 35729
