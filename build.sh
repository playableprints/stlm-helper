#!/bin/bash

# GOOS=windows GOARCH=amd64 go build -o stl3mf-win-amd64.exe
# GOOS=darwin GOARCH=amd64 go build -o stl3mf-macos-amd64
# GOOS=darwin GOARCH=arm64 go build -o stl3mf-macos-arm64
# GOOS=linux GOARCH=amd64 go build  -o stl3mf-linux-amd64

DATENOW=`date -u +%Y%m%d.%H%M%S`

wails build -platform windows/amd64 -o stlm-helper-win-${DATENOW}.exe
wails build -platform darwin/universal -o stlm-helper-macos-${DATENOW}
wails build -platform linux/amd64 -o stlm-helper-linux-${DATENOW}
