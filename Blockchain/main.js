//blockchain restricts users from changing/deleting the contents of the blockchain, so if one element is changed, the whole blockchain becomes invalid


const SHA256 = require('crypto-js/sha256');

//this is a single block
class Block {
    constructor(index, timestamp, data, previousHash = '') {
        //index -> where it sits in the blockchain
        //data -> data going into the block (details of transaction)
        //previousHash -> hash of the block before this block 
        //ensures integrity of block
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    //difficulty increases the computing time needed to meet the requirement of the hash
    //the more zeros difficulty has, the harder it is to compute
    mineBlock(difficulty) {
        //we create an array with zeros that is exactly the number of difficulty
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log(this.hash);
    }
}



//this is the block chain
class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()]; //the first block (genesis) is always created manually
    }

    createGenesisBlock() {
        return new Block(0, '01/01/2020', 'genesis block', '0');
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }

    isChainValid() {
        for (let i =  1; i < this.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

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

let coin = new Blockchain();
coin.addBlock(new Block(1, '10/10/2020', { amount: 4 }));
coin.addBlock(new Block(2, '10/9/2020', { amount: 1 }));

console.log(JSON.stringify(coin, null, 4));