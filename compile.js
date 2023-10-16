// import solc from 'solc';
// import path from 'path';
// import fs from 'fs';
const solc = require('solc')
const path = require('path')
const fs = require('fs')
// import { isUtf8 } from 'buffer';

const filename = 'MyContract.sol';
const contractName = 'MyContract';

const contractPath = path.join(__dirname, filename);
const sourceCode = fs.readFileSync(contractPath, 'utf8');

const input = {
    language: 'Solidity',
    sources: {
        [filename]: {
            content: sourceCode,
        }
    },
    settings: {
        outputSelection: {
            '*': {
                '*': ['*']
            }
        }
    }
};

const compiledCode = JSON.parse(solc.compile(JSON.stringify(input)));
const bytecode = compiledCode.contracts[filename][contractName].evm.bytecode.object;

const bytecodePath = path.join(__dirname, 'MyContractBytecode.bin');
fs.writeFileSync(bytecodePath, bytecode);

console.log("Contract ByteCode: ", bytecode);

// Get ABI from the compiled contract
const abi = compiledCode.contracts[filename][contractName].abi;

const abiPath = path.join(__dirname, 'MyContractAbi.json');
fs.writeFileSync(abiPath, JSON.stringify(abi, null, '\t'));

console.log("Abi: ", abi);
