const EC = require('elliptic').ec;
//this includes functionality to sign something and verify a signature

const ec = new EC('secp256k1');

const key = ec.genKeyPair(); //this will be used to verify and sign signatures
const publicKey = key.getPublic('hex');
const privateKey = key.getPrivate('hex');

console.log(privateKey);
console.log();
console.log(publicKey);

//private 042746b8ce6cde8b0963ff3bd1290eb8ae9dbeca313c9514dc3e3664f01d66b8dafeac9d8ab70bf68a81bc9c7aa269ef5
//public e861c6a9dc65e96f2a1cb4c82727ea5bf

