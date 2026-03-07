#!/bin/bash

cd options_page
npm run build
cd ../pages
rm -rf side_panel
cp -r ../options_page/dist side_panel