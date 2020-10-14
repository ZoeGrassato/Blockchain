//blockchain restricts users from changing/deleting the contents of the blockchain, so if one element is changed, the whole blockchain becomes invalid

//uses pending transactions -> we only create blocks in a specific interval, all blocks that are pending and have not yet been processed, go into a pending transactions array
//pending transactions go into the Blockchain object itself


const SHA256 = require('crypto-js/sha256');

class Transaction {
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
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

    createTransaction(transaction) {
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

coin.createTransaction(new Transaction('address1', 'address2', 100))
//at this point the transactions are still pending and we need to mine to actually add to the blockchain

//now we are minin/adding to the blockchain
console.log('mining transactions....');
coin.minePendingTransactions('zoe');

//now lets see what the balance of that address is
balance = coin.getBalanceOfAddress('zoe');
console.log(balance);

//now we are minin/adding to the blockchain
console.log('mining transactions again....');
coin.minePendingTransactions('zoe');

balance = coin.getBalanceOfAddress('zoe');
console.log(balance);



