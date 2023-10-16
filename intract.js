const { Web3 } = require('web3');
const fs = require('fs');
const path = require('path');

const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'))
web3.eth.Contract.handleRevert = true;

const deployedAddressPath = path.join(__dirname, 'MyContractAddress.bin');
const deployedAddress = fs.readFileSync(deployedAddressPath, 'utf8')

const byteCodePath = path.join(__dirname, 'MyContractBytecode.bin');
const byteCode = fs.readFileSync(byteCodePath, 'utf8')

const abi = require('./MyContractAbi.json')
const MyContract = new web3.eth.Contract(abi, deployedAddress);


async function interact() {
    const providerAccounts = await web3.eth.getAccounts();
    const defualtAccount = providerAccounts[0];

    try {
        const myNumber = await MyContract.methods.myNumber().call();
        console.log('my number value: ' + myNumber);

        const receipt = await MyContract.methods.setMyNumber(myNumber + 1n).send({
            from: defualtAccount,
            gas: 1000000,
            gasPrice: 10000000000,
        });
        console.log('Transaction Hash: ' + receipt.transactionHash)
        const myNumberUpdated = await MyContract.methods.myNumber().call();
        console.log('my number updated value: ' + myNumberUpdated);
    }
    catch (error) {
        console.error(error);
    }
}

interact();