const express = require("express");
const app = express();
const server = require("http").createServer(app);
const cors = require("cors");
const Web3 = require("web3");
const HDWallet = require("@truffle/hdwallet-provider");
//const ethers = require("ethers");

app.use(cors());
app.use(express.json());

const PORT = 3003;

// web3 connection
const Wheel = require("../client/src/contracts/Wheel.json");
const web3 = new Web3(
  new HDWallet(
    "a98e1dabac1286180fc766a17198bbdc3f8ef2866515a3b71cf29e568b9ad63e",
    "wss://ropsten.infura.io/ws/v3/5c9c25b98b1b4e34b2b0f29925bc2e6a"
  )
);

const walletAddress = "0x4854Ebc0E6a0e81555d220f2Fc1FD4cc775397D9";
const gamesContractAddr = "0xE6C6DebA411C6A48eE6372B339189956f4137Be1";
const contract = new web3.eth.Contract(Wheel.abi, gamesContractAddr);

const bettingTime = 60000;
const spinningTime = 5000;
const resultsTime = 5000;

const States = {
  NOTSTARTED: "0",
  BETTING: "1",
  IDLE: "2", // spinning
  COMPLETED: "3",
};

let currentState = States.NOTSTARTED;

const runGame = async () => {
  const startBetting = async () => {
    currentState = States.BETTING;

    try {
      await contract.methods
        .setState(States.BETTING)
        .send({ from: walletAddress, gas: 3000000 });
    } catch (err) {
      console.log(err);
    }

    console.log("CURRENT STATE:", await contract.methods.getState().call());
    setTimeout(await startSpinning, bettingTime);
  };

  const startSpinning = async () => {
    try {
      await contract.methods
        .setState(States.IDLE)
        .send({ from: walletAddress, gas: 3000000 });
    } catch (err) {
      console.log(err);
    }
    console.log("CURRENT STATE:", await contract.methods.getState().call());
    setTimeout(await startEnding, spinningTime);
  };

  const startEnding = async () => {
    try {
      await contract.methods
        .setState(States.COMPLETED)
        .send({ from: walletAddress, gas: 3000000 });
    } catch (err) {
      console.log(err);
    }

    console.log("CURRENT STATE:", await contract.methods.getState().call());
    setTimeout(await runGame, resultsTime);
  };

  try {
    await contract.methods
      .setState(States.NOTSTARTED)
      .send({ from: walletAddress, gas: 3000000 });
  } catch (err) {
    console.log(err);
  }

  setTimeout(startBetting, 2000);
  console.log("CURRENT STATE:", await contract.methods.getState().call());
};

/*
const ethersContract = new ethers.Contract(gamesContractAddr, Wheel.abi, web3);
ethersContract.on("WinningMultiplier", (winningMultiplier_) => {
  //console.log("WINNING MULTI: ", winningMultiplier_);
});

contract.events
  .WinningMultiplier({})
  .on("data", (event) => console.log(event.returnValues.winningMultiplier_));*/
runGame();

server.listen(process.env.PORT || PORT, () => {
  console.log(`Server running on port ${PORT}.`);
});
