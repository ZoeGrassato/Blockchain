const {Blockchain, Transaction} = require('./blockchain');

let coin = new Blockchain();
coin.createTransaction(new Transaction('address1', 'address2', 100))
//at this point the transactions are still pending and we need to mine to actually add to the blockchain

//now we are mining/adding to the blockchain
console.log('mining transactions....');
coin.minePendingTransactions('zoe');

//now lets see what the balance of that address is
balance = coin.getBalanceOfAddress('zoe');
console.log(balance);

//now we are mining/adding to the blockchain
console.log('mining transactions again....');
coin.minePendingTransactions('zoe');

balance = coin.getBalanceOfAddress('zoe');
console.log(balance);

balance = coin.getBalanceOfAddress('zoe');
console.log(balance);



