# stlm-helper

## About this app

stlm-helper is a grab-bag of utilities for messing around with filesystems and 3D models, built from the React/Typescript template using [Wails](wails.io).

This repo builds a single executable that produces a UI to click buttons on.

## Setting up a development environment

Use the Wails instructions to setup and configure Go and Nodejs: https://wails.io/docs/gettingstarted/installation

To get started once this repo is checked out:

- `cd frontend && npm install && npm run build`
- `cd .. && wails dev`

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

## Technical resources

- https://go.dev
- https://nodejs.org/
- https://reactjs.org
- https://www.typescriptlang.org

## License

Copyright © 2022 Rob Mayer (rob@thatrobhuman.com), Pieter Sartain (piete@hyperrational.tech)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
