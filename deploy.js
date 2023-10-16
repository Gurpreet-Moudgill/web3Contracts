const {Web3} = require('web3');
const fs = require('fs');
const path = require('path');

const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'))
web3.eth.Contract.handleRevert = true;

const byteCodePath = path.join(__dirname, 'MyContractBytecode.bin');
const byteCode = fs.readFileSync(byteCodePath, 'utf8')

const abi = require('./MyContractAbi.json')
const MyContract = new web3.eth.Contract(abi);

async function deploy() {
    const providersAccounts = await web3.eth.getAccounts();
    const defualtAccount = providersAccounts[0];
    console.log('Deployer Account: ', defualtAccount);

    const myContract = MyContract.deploy({
        data : '0x' + byteCode,
        arguments: [1]
    });
    const gas = await myContract.estimateGas({
        from: defualtAccount,
    });
    console.log('estimated gas: ', gas);

    try{
        const tx = await myContract.send({
            from: defualtAccount,
            gas,
            gasPrice: 10000000000,
        });
        console.log('contract address: ' + tx.options.address)

        const deployedAddressPath = path.join(__dirname, 'MyContractAddress.bin');
        fs.writeFileSync(deployedAddressPath, tx.options.address);
    }
    catch(error){
        console.error(error);
    }
}

deploy();

