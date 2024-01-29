# Developing on stlm-helper

stlm-helper is a grab-bag of utilities for messing around with filesystems and 3D models, built from the React/Typescript template using [Wails](wails.io).

This repo builds a single executable that produces a UI to click buttons on.

## Setting up a development environment

Use the Wails instructions to setup and configure Go and Nodejs: https://wails.io/docs/gettingstarted/installation

To get started once this repo is checked out:

-   `cd frontend && npm install && npm run build`
-   `cd .. && wails dev`

## About Wails

You can configure the project by editing `wails.json`. More information about the project settings can be found here: https://wails.io/docs/reference/project-config

## Live Development

To run in live development mode, run `wails dev` in the project directory. This will run a Vite development
server that will provide very fast hot reload of your frontend changes. If you want to develop in a browser
and have access to your Go methods, there is also a dev server that runs on http://localhost:34115. Connect
to this in your browser, and you can call your Go code from devtools.

## Building

To build a redistributable, production mode package, use `wails build`.

`build.sh` generates timestamped binaries (relies on having bash shell available). Wails doesn't currently crosscompile from Windows -> Linux or Windows -> MacOS.
