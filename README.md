# WebAssembly in a webWorker

# Context
The client required an SDK/NPM library to enable JS/TS applications to interact with a specific Layer 1 Blockchain.

# Objective: 
The library needed to generate ProofOfWork, a fundamental component in the blockchain ecosystem. This code, written in C++, generates hashes to validate blockchain blocks.

# Challenge
Generating or solving hashes is resource-intensive. The goal was to efficiently execute this process in both browser-based JS/TS applications and server-side NodeJS without hindering the main thread, ensuring a responsive UI.

# Solution
Overview: Implemented a Web Worker to execute a wrapper function over the .wasm binary in a separate background thread.

## Steps:
### Wasm Binary Wrapping: 
Utilised the wasm2js library to encapsulate the .wasm binary within a commonJS module, making it compatible with both Node.js and browsers.

### Web Worker Integration: 
Converted the commonJS module into a string to serve as an input for the Web Worker's constructor.

### Worker Definition: 
Dynamically constructed the workerDefinition using string concatenation. This wrapper aids in the communication between the application and the generated commonJS module via the Web Worker. The module's reference to the .wasm binary varied based on the environment (browser or server).

#### Server: 
Directly referenced the .wasm binary using its path and leveraged the fs module to create a .cjs file from the workerDefinition. This file was essential for worker instantiation.

#### Browser: 
Encoded the .wasm file as a base64 blob for referencing within the workerDefinition. This was necessary due to filesystem inaccessibility and webpack's runtime path issues. Subsequently, a Blob was created from the workerDefinition for worker instantiation.

# Usage
This function was incorporated into the Blockchain Wallet Extension project (mentioned in my CV). Users could optionally generate PoW in the background while browsing or working on other tasks.
