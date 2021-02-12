var level = require('level');
var chainDB = './chaindata';
var db = level(chainDB);
const SHA256 = require('crypto-js/sha256');
// import block class
const BlockClass = require('./Block.js')

//Use promise variable to detect success or failure
function addDBData(key, value) {
    return new Promise((resolve, reject) => {
        db.put(key, value, (err) => {
            if (err) {
                console.log('Failed to add ' + key + ' to the blockchain', err)
                reject(err)
            }
            else {
                console.log('Block number: ' + key + ' stored successfuly')
                resolve(value)
            }
        })
    })
}

// Get data from DB with key
//Use promise variable to detect success or failure
function getDBData(key) {
    return new Promise((resolve, reject) => {
        db.get(key, (err, value) => {
            if (err) {
                console.log('Cannot resolve the value!', err)
                reject(err)
            } else {
                resolve(value)
            }
        })
    })
}


/* ===== Blockchain ===================================
|  Class with a constructor for blockchain data model  |
|  with functions to support:                          |
|     - createGenesisBlock()                           |
|     - getLatestBlock()                               |
|     - addBlock()                                     |
|     - getBlock()                                     |
|     - validateBlock()                                |
|     - validateChain()                                |
|  ====================================================*/

class Blockchain {

    constructor() {
        //Maintain the first block
        this.getHeight().then((size) => {
            if (size === -1) {
                let block = this.createGenesisBlock();
                this.addBlock(block)
            };
        })
    }

    // Get block height of the block chain
    async getHeight() {
        //Promise object to determine whether the height was successfully determined or an error occurred
        return new Promise((resolve, reject) => {
            var height = -1
            db.createReadStream().on('data', (data) => {
                height++
            }).on('error', (err) => {
                console.log('There was an error reading the data!', err)
                reject(err)
            }).on('close', () => {
                resolve(height)
            })
        })
    }

    createGenesisBlock() {
        return new Block("First block in the chain - Genesis block");
    }

    // getLatest block method
    getLatestBlock() {
        var block;
        db.createReadStream()
            .on('data', function (data) {
                block = JSON.parse(data.value);
            }).on('error', function (err) {
                return console.log('Unable to read data stream!', err)
            }).on('close', function () {
                console.log(`Latest Block is: ${JSON.stringify(block)}`);
            });
    }

    async getBlock1(index) {
        // return Block as a JSON object
        var key;
        var block;
        var found = false;
        await db.createReadStream()
            .on('data', function (data) {
                key = JSON.parse(data.key);
                block = JSON.parse(data.value);
                if (key == index) {
                    console.log(`Block is found: ${JSON.stringify(block)}`);
                    found = true;
                }
            }).on('error', function (err) {
                return console.log('Unable to read data stream!', err)
            }).on('close', function () {
                if (!found) {
                    console.log("No Block exist with the given index");
                }
                return block;
            });

    }

    // get the block at the identified index
    async getBlock(index) {
        // return Block as a JSON object
        return JSON.parse(await getDBData(index))
    }
    //getBlockByHash method
    getBlockByHash(hash) {
        var block;
        var found = false;
        db.createReadStream()
            .on('data', function (data) {
                block = JSON.parse(data.value);
                if (block.hash == hash) {
                    console.log(`Block is found: ${JSON.stringify(block)}`);
                    found = true;
                }
            }).on('error', function (err) {
                return console.log('Unable to read data stream!', err)
            }).on('close', function () {
                if (!found) console.log("No Block exist with the given hash");
            });
    }

    // addBlock method
    async addBlock(newBlock) {
        var maxHeight = parseInt(await this.getHeight());
        newBlock.height = maxHeight;
        if (maxHeight >= 0) {
            var prevBlock = await this.getBlock(maxHeight);
            newBlock.previousHash = prevBlock.hash;
        }
        // UTC timestamp
        newBlock.timeStamp = new Date().getTime().toString().slice(0, -3);
        // SHA256 requires a string of data
        newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
        newBlock.height++;
        console.log(newBlock)
        // add block to chain
        await addDBData(newBlock.height, JSON.stringify(newBlock).toString());
    }

}

module.exports.Blockchain = Blockchain;
// // testing area
// let b = new Blockchain();
// b.addBlock(new BlockClass.Block('bbbb'));
// b.addBlock(new Block('cccc'));
// b.addBlock(new Block('dddd'));
// // console.log(map)
// console.log('height ='+ b.height);
//  b.getBlock(6);
//  b.getLatestBlock();
// b.getBlockByHash('cde4e1093f48e2f2315ee0d1dad5d6df20d8962bb66e0d131595eec2eb211d02t');


