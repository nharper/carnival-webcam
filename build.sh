#!/bin/bash
set -e
cd "$(dirname "$0")"

rm -r webroot
mkdir webroot
pushd src
  browserify -t [ babelify --presets [ react ] ] index.js -o ../webroot/index.js
popd
cp -r assets/* webroot
