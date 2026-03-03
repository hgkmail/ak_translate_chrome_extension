#!/bin/bash

cd options_page
npm run build
cd ..
rm -rf assets
cp -r options_page/dist/* .