const SHA256 = require('crypto-js/sha256');

class Block {
    constructor (index, timestamp, data, previousHash) {
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

    mineBlock(difficulty) {
        while(this.hash.substring(0,difficulty) != Array(difficulty + 1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log('Blocked mined: ', this.hash);
    }
}

class Blockchain {
    constructor () {
       this.chain = [this.createGenesisBlock()];
       this.difficulty = 5;
    }

    createGenesisBlock() {
        return new Block(0, '01/01/2020', "Genesis Block", "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }

    isChainValid() {
        for( let i = 1; i< this.chain.length; i++){
            const currBlock = this.chain[i];
            const prevBlock = this.chain[i-1];
            if (currBlock.hash !== currBlock.calculateHash()) {
                return false;
            }
            if (currBlock.previousHash !== prevBlock.hash) {
                return false;
            } 
        }
        return true;
    }
}

let newCoin = new Blockchain();

console.log('Mining block 1...');
newCoin.addBlock(new Block(1, '20/01/2020', {amount: 1} ));

console.log('Mining block 2...');
newCoin.addBlock(new Block(2, '22/01/2020', {amount: 10} ));

console.log('Mining block 3...');
newCoin.addBlock(new Block(3, '28/01/2020', {amount: 15} ));

// newCoin.chain[1].data = {amount: 12};
// newCoin.chain[1].hash = newCoin.chain[1].calculateHash();
// console.log("Is chain valid: ", newCoin.isChainValid());


console.log('Mining block 4...');
newCoin.addBlock(new Block(3, '38/01/2020', {amount: 25} ));

//console.log(JSON.stringify(newCoin, null, 6));