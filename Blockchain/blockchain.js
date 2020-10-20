//blockchain restricts users from changing/deleting the contents of the blockchain, so if one element is changed, the whole blockchain becomes invalid

//uses pending transactions -> we only create blocks in a specific interval, all blocks that are pending and have not yet been processed, go into a pending transactions array
//pending transactions go into the Blockchain object itself

//in order to secure that people can only use their own amount in a wallet, we need to use a key algorithm

const EC = require('elliptic').ec;
//this includes functionality to sign something and verify a signature
const ec = new EC('secp256k1');
const SHA256 = require('crypto-js/sha256');

//you can only spend money from the wallet for which you have the private key for
class Transaction {
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }

    calculateHash(){ 
        return SHA256(this.fromAddress + this.toAddress + this.amount).toString();
    }

    signTransaction(signingKey){
        if(signingKey.getPublic('hex') !== this.fromAddress){
            throw Error('You cant sign this transaction')
        }

        const hashTx = this.calculateHash(); //hash to sign
        const sig = signingKey.sign(hashTx, 'base64'); //here we sign using the hash
        this.signature = sig.toDER('hex');
    }

    isValid(){
        if(this.fromAddress === null) return true;

        //check that there is a signature
        if(!this.signature || this.signature.length === 0){
            throw new Error('No signature in this transaction');
        }
        //check that the signature is as it should be 
        const publicKey = ec.keyFromPublic(this.fromAddress, 'hex');
        return publicKey.verify(this.calculateHash(), this.signature);
        //here we verify that this hashed was signed with the signature given for this entry
    }
}

//this is a single block
class Block {
    constructor(timestamp, transactions, previousHash = '') {
        //index -> where it sits in the blockchain
        //data -> data going into the block (details of transaction)
        //previousHash -> hash of the block before this block 
        //ensures integrity of block
        this.timestamp = timestamp;
        this.transactions = transactions; //array of transactions
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString(); //we need nonce to make it unique every time
    }

    //difficulty increases the computing time needed to meet the requirement of the hash
    //the more zeros the difficulty has, the harder it is to compute
    mineBlock(difficulty) { //this it to create a new block
        //we create an array with zeros that is exactly the number of difficulty
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log(this.hash);
    }

    hasValidTransactions(){
        for(const tx of this.transactions){
            if (!tx.isValid) return false;
        }
        return true;
    }
}



//this is the block chain
class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()]; //the first block (genesis) is always created manually
        this.difficulty = 2;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }

    createGenesisBlock() {
        return new Block('01/01/2020', 'genesis block', '0');
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    //-----------replaced by below method--------------
    //addBlock(newBlock) { 
    //    newBlock.previousHash = this.getLatestBlock().hash;
    //    newBlock.mineBlock(this.difficulty); //here we set our blocks hash by mining       with difficulty
    //    this.chain.push(newBlock);
    //}

    minePendingTransactions(miningRewardAddress) { //this is to add to the blockchain
        let block = new Block(Date.now(), this.pendingTransactions);
        block.mineBlock(this.difficulty); //mine for a hash in alignment with our difficulty
        console.log("block has been mined");
        this.chain.push(block);

        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ];
    }

    addTransaction(transaction) {
        if(!transaction.fromAddress || !transaction.toAddress){
            throw new Error("");
        }

        if(!this.transaction.isValid()){
            throw new Error("");
        }
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address) {
        let balance = 0;

        for (const block of this.chain) {
            for (const trans of block.transactions) {
                if (trans.fromAddress === address) {
                    balance -= trans.amount;
                }
                if (trans.toAddress === address) {
                    balance += trans.amount;
                }
            }
        }

        return balance;
    }

    isChainValid() {
        for (let i =  1; i < this.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if(!currentBlock.hasValidTransactions()) return false;
            //is the hash correct
            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            //is the previous hash correct
            if (currentBlock.previousHash !== previousBlock.previousHash) {
                return false;
            }
        }
        return true;
    }
}

module.exports.Blockchain =  Blockchain;
module.exports.Transaction = Transaction;