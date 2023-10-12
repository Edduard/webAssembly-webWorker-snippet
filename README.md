# WebAssembly in a webWorker

# Context
The client needed to have a SDK / NPM library in order for JS/TS apps to communicate and do operations on a specific Layer 1 Blockchain.


Among other operations, the library should have a way to generate ProofOfWork . Basically it's a piece of code written in C++ that generates hashes and therefore validates the blocks in the blockchain. It’s the most fundamental piece of the puzzle in this ecosystem.

# Challenge
The process of generating / solving hashes is computationally intensive, necessitating an efficient way to run it in the browser (any JS/TS app) and on the server (NodeJS). Most importantly, running the code shouldn’t slow the main thread which would lead to an unusable UI. 

# Solution
The birds eye view of the solution is having a Web Worker run a wrapper function over the .wasm binary on a separate worker thread in the background.

- Used wasm2js library to wrap the .wasm binary with a commonJS module that can be imported in Node.js and the browser.

- Included the commonJS module into a string in order to be used as a parameter sent to the constructor of the web worker.

- Used string concatenation in order to dynamically create the workerDefinition which is a wrapper that facilitates the communication between the app and the generated commonJS module through the web worker. The commonJS module inside the workerDefinition had a reference to the .wasm binary that needed to be declared differently for the browser and the server(nodeJS).

On server:
- The .wasm binary was referenced directly with a path to it. Then I used ‘fs’ in order to generate a .cjs file from the workerDefinition on the filesystem that was used to instantiate the worker.

On Browser
- Encoded the .wasm file into a base64 blob in order to be referenced (as a variable) in the workerDefinition (because we don’t have access to the filesystem and because webpack had trouble making the path to .wasm file accessible at runtime). Then created a Blob from the workerDefinition that was used to instantiate the worker.

In the end the output is the generatePoW function that returns a promise that gets resolved or rejected when the pow wasm module is done executing. It runs in a parallel web worker and can be instantiated multiple times and run in the background. 


# Usage
This function was later exported from the TS Library and used in the Blockchain Wallet Extension project (referenced in my CV) where users could voluntarily generate PoW in the background while browsing and doing some other work.
