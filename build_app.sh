#!/bin/bash

set -e
npm run ionic:build
ionic platform add android
ionic build android --release
ionic build android --release