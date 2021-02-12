## Steps to follow

1. Clone the repository to your local computer.
2. Open the terminal and install the packages: `npm install`.
3. Run your application `node app.js`
5. Test the Endpoints with Curl or Postman.

The web API contains a GET endpoint that responds to a request using a URL path with a block height parameter or properly handles an error if the height parameter is out of bounds.

The response for the endpoint provides a block object in JSON format.

URL: http://localhost:8000/block/0

Response:

{
"hash":"49cce61ec3e6ae664514d5fa5722d86069cf981318fc303750ce66032d0acff3",
"height":0,
"body":"First block in the chain - Genesis block",
"time":"1530311457",
"previousBlockHash":"0x"
}

The web API contains a POST endpoint that allows posting a new block with the data payload option to add data to the block body. Block body should support a string of text.

URL: http://localhost:8000/block

{
      "body": "Testing block with test string data"
}
The response for the endpoint is a block object in JSON format.