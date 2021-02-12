const SHA256 = require('crypto-js/sha256');
const BlockClass = require('./Block.js');
const BC = require('./simpleChain.js');
/**
 * Controller Definition to encapsulate routes to work with blocks
 */
class BlockController {

    /**
     * Constructor to create a new BlockController, you need to initialize here all your endpoints
     * @param {*} app 
     */
    constructor(app) {
        this.blockChian = new BC.Blockchain();
        this.app = app;
        //this.blocks = [];
        //this.initializeMockData();
        this.getBlockByIndex();
        this.postNewBlock();
    }

    /**
     * Implement a GET Endpoint to retrieve a block by index, url: "/api/block/:index"
     */
    getBlockByIndex() {
        this.app.get("/api/block/:index", async (req, res) => {
            let response = "";
            //getting index parameter
            let blockIndex = req.params["index"];
            if (blockIndex) {
                //getting requested block
                let block = await this.blockChian.getBlock(blockIndex);
                response = block;
            } else response = "Missing block index from the request";
            //sending block as response
            res.send(response);
        });
    }

    /**
     * Implement a POST Endpoint to add a new Block, url: "/api/block"
     */
    postNewBlock() {
        this.app.post("/api/block", async (req, res) => {
            let response = "";
            //getting data
            let data = req.body.data;
            console.log(`data: ${data}`);
            if (data) {
                //createing block
                let block = new BlockClass.Block(data);
                await this.blockChian.addBlock(block);
                response = "block added successfully";
            } else response = "No data is received ERROR!";
            res.send(response);
        });
    }

    /**
     * Help method to inizialized Mock dataset, adds 10 test blocks to the blocks array
     */
    initializeMockData() {
        if (this.blocks.length === 0) {
            for (let index = 0; index < 10; index++) {
                let blockAux = new BlockClass.Block(`Test Data #${index}`);
                blockAux.height = index;
                blockAux.hash = SHA256(JSON.stringify(blockAux)).toString();
                this.blocks.push(blockAux);
            }
        }
    }

}

/**
 * Exporting the BlockController class
 * @param {*} app 
 */
module.exports = (app) => { return new BlockController(app); }