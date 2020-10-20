const EC = require('elliptic').ec;
//this includes functionality to sign something and verify a signature
const ec = new EC('secp256k1');
const SHA256 = require('crypto-js/sha256');

const myKey = ec.keyFromPrivate('');
const myWalletAddress = myKey.getPublic('hex'); //our wallet address is our from address

const {Blockchain, Transaction} = require('./blockchain');

let coin = new Blockchain();

const tx1 = new Transaction(myWalletAddress, 'pk goes here', 10) //second param will have public key of recipient
//next we need to sign our transaction
tx1.signTransaction(myKey);
coin.addTransaction(tx1);

//at this point the transactions are still pending and we need to mine to actually add to the blockchain

//now we are mining/adding to the blockchain
console.log('mining transactions....');
coin.minePendingTransactions(myWalletAddress);

//now lets see what the balance of that address is
balance = coin.getBalanceOfAddress(myWalletAddress);
console.log(balance);

balance = coin.getBalanceOfAddress(myWalletAddress);
console.log(balance);



