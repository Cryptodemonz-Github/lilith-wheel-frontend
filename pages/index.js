import { Box } from "grommet";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useState, useEffect } from "react";
import { grommet } from "grommet/themes";
import { Grommet, Heading } from "grommet";
import "../styles/Home.module.css";
import { deepMerge } from "grommet/utils";
import Web3 from "web3";
import Wheel from "../src/contracts/Wheel.json";
import LLTH from "../src/contracts/LLTH.json";
import WheelComponent from "./wheelComponent.js";
import styled, { css } from "styled-components";
import TxModal from "./txModal";
import UnderHeaderText from "./underHeaderText";
import BottomButtons from "./bottomButtons";
import ResultModal from "./resultModal";

const customTheme = {
  rangeInput: {
    thumb: {
      color: "#9933FF",
      extend: `
      border-radius: 0px;
    `,
    },
    track: {
      color: "#fff",
    },
  },
  button: {
    border: {
      radius: "4px",
    },
    hover: {
      color: "#81FCED",
    },
  },

  global: {
    hover: {
      color: "#2D2102",
    },
    font: {
      family: "MonoPixel-Awesome",
    },
    colors: {
      active: "#9832FE",
      border: "#000",
      placeholder: "#fff",
      text: "#fff",
    },
    focus: {
      shadow: {
        color: "#33FFFF",
      },
      border: {
        color: "#000",
      },
    },

    drop: {
      background: "#000",
      elevation: "none",
      hover: "#33FFFF",
      extend: `

            font-size: 14px;
            border-bottom-left-radius: 1px;
            border-bottom-right-radius: 1px;
            li {
              border-bottom: 1px solid rgba(0, 0, 0, 0.2);
            }
            overflow: hidden;
          `,
    },
  },
};

const Container = styled.div``;

export default function Home() {
  const [valueBet, setValueBet] = useState(undefined);
  const [multiplier, setMultiplier] = useState(2);
  const [winningMultiplier, setWinningMultiplier] = useState(undefined);
  const [connected, setConnected] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [web3, setWeb3] = useState(undefined);
  const [contract, setContract] = useState(undefined);
  const [token, setToken] = useState(undefined);
  const [placedBet, setPlacedBet] = useState(false);
  const [owner, setOwner] = useState(undefined);
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [txStarted, setTxStarted] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const [won, setWon] = useState(false);
  const gameAddress = "0x4eA39159f493fD8AbAb7CD7bF737879B090EBD3E";
  const tokenAddress = "0xD5E083A22aEEF32Cb66304785a61893F59214998";
  const [reset, setReset] = useState(false);
  const [rotateValue, setRotateValue] = useState(undefined);
  const [requestId, setRequestId] = useState(undefined);

  const web3Socket = new Web3(
    new Web3.providers.WebsocketProvider("wss://ws-mumbai.matic.today/")
  );
  const contractWeb3Socket = new web3Socket.eth.Contract(
    Wheel.abi,
    gameAddress
  );

  const rotateValues = {
    2: 4700, // segment: rotation
    3: 3950,
    4: 3550,
    5: 4250,
    6: 3500,
    7: 3820,
    8: 3800,
    9: 3400,
    10: 4100,
    11: 3700,
    12: 4400,
    13: 3650,
  };

  useEffect(() => {
    const init = async () => {
      if (token !== undefined) {
        const balance = await token.methods.balanceOf(gameAddress).call();
        console.log("balance: ", balance);
      }

      const accounts = await window.ethereum
        .request({
          method: "eth_accounts",
        })
        .catch((err) => {
          if (err.code === 4001) {
            console.log("Please connect to MetaMask.");
          } else {
            console.error(err);
          }
        });
      setAccounts(accounts);
    };

    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      const owner = web3.eth.accounts.privateKeyToAccount(
        process.env.NEXT_PUBLIC_PRIVATE_KEY
      );

      setOwner(owner);
      setWeb3(web3);
      setContract(new web3.eth.Contract(Wheel.abi, gameAddress));
      setToken(new web3.eth.Contract(LLTH.abi, tokenAddress));

      init();
    }
  }, []);

  useEffect(() => {
    contractWeb3Socket.events.RequestIdIsCreated({}).on("data", (event) => {
      //console.log("player: ", event.returnValues.player);
      //console.log("accounts[0]: ", accounts[0]);
      if (
        accounts[0] &&
        event.returnValues.player.toUpperCase() === accounts[0].toUpperCase()
      ) {
        //console.log("requestId: ", event.returnValues.requestId);
        setRequestId(event.returnValues.requestId);
      }
    });
  }, [accounts]);

  useEffect(() => {
    contractWeb3Socket.events.RandomIsArrived({}).on("data", (event) => {
      if (requestId && event.returnValues.requestId === requestId) {
        //console.log("randomNumber: ", event.returnValues.randomNumber);
        setWinningMultiplier(event.returnValues.randomNumber);
      }
    });
  }, [requestId]);

  useEffect(() => {
    if (accounts !== undefined && accounts.length > 0) {
      setConnected(true);
    } else {
      setConnected(false);
    }
  }, [accounts]);

  useEffect(() => {
    const closeRound = async () => {
      const tx = await contract.methods.closeRound(accounts[0]);
      await send(web3, owner, tx);
    };
    const init = async () => {
      if (placedBet) {
      } else if (isSpinning) {
        await closeRound();
      }
    };
    init();
  }, [placedBet, isSpinning]);

  const placeBet = async () => {
    console.log("multi: ", multiplier);
    setTxStarted(true);

    if (
      (await token.methods.allowance(accounts[0], gameAddress).call()) <
      web3.utils.toWei(valueBet.toString(), "ether")
    ) {
      await token.methods
        .approve(
          gameAddress,
          web3.utils.toWei(web3.utils.toBN(100000000000), "ether")
        )
        .send({ from: accounts[0], gas: 3000000 });
    }
    await contract.methods
      .placeBet(web3.utils.toWei(valueBet.toString(), "ether"), multiplier)
      .send({ from: accounts[0], gas: 3000000 });

    setPlacedBet(true);
  };

  useEffect(() => {
    setRotateValue(rotateValues[winningMultiplier]);
    if (multiplier === winningMultiplier) {
      setWon(true);
    } else {
      setWon(false);
    }
  }, [winningMultiplier]);

  useEffect(() => {
    setTxStarted(false);
    setIsTxModalOpen(false);
  }, [rotateValue]);

  async function send(web3, account, transaction) {
    const options = {
      to: transaction._parent._address,
      data: transaction.encodeABI(),
      gas: 3000000,
    };
    const signed = await web3.eth.accounts.signTransaction(
      options,
      account.privateKey
    );
    const receipt = await web3.eth.sendSignedTransaction(signed.rawTransaction);
    return receipt;
  }

  return (
    <Container>
      <Grommet
        theme={deepMerge(grommet, customTheme)}
        style={{
          backgroundColor: "#000",
        }}
      >
        <Head>
          <title>DEMONZ WHEEL</title>
        </Head>
        <div className={styles.container}>
          <Box animation={{ type: "zoomOut", duration: 2000, size: "large" }}>
            <Heading size="large" color="#fff">
              DEMONZ WHEEL
            </Heading>
          </Box>
          <Box animation={{ type: "fadeIn", duration: 1000, size: "xlarge" }}>
            <UnderHeaderText
              connected={connected}
              placedBet={placedBet}
              valueBet={valueBet}
              multiplier={multiplier}
            />
          </Box>
          <div className={styles.grid}>
            <Box direction="column" pad="medium" gap="large">
              <WheelComponent
                key={reset}
                isSpinning={isSpinning}
                setIsSpinning={setIsSpinning}
                setIsEnded={setIsEnded}
                winningMultiplier={winningMultiplier}
                rotateValue={rotateValue}
              />

              <Box
                animation={{
                  type: "zoomIn",
                  duration: 1000,
                  size: "xlarge",
                }}
              >
                <BottomButtons
                  placedBet={placedBet}
                  connected={connected}
                  setAccounts={setAccounts}
                  setIsSpinning={setIsSpinning}
                  setIsTxModalOpen={setIsTxModalOpen}
                  isSpinning={isSpinning}
                  isEnded={isEnded}
                />
              </Box>
            </Box>
            {isTxModalOpen && (
              <TxModal
                txStarted={txStarted}
                valueBet={valueBet}
                setValueBet={setValueBet}
                multiplier={multiplier}
                setMultiplier={setMultiplier}
                connected={connected}
                setConnected={setConnected}
                placeBet={placeBet}
                setTxStarted={setTxStarted}
              />
            )}

            {isEnded && (
              <ResultModal
                setValueBet={setValueBet}
                setMultiplier={setMultiplier}
                setWinningMultiplier={setWinningMultiplier}
                setPlacedBet={setPlacedBet}
                setTxStarted={setTxStarted}
                setIsEnded={setIsEnded}
                won={won}
                setWon={setWon}
                valueBet={valueBet}
                winningMultiplier={winningMultiplier}
                reset={reset}
                setReset={setReset}
              />
            )}
          </div>
          <Box animation={{ type: "fadeIn", duration: 1000, size: "xlarge" }}>
            <footer className={styles.footer}>
              <a href="https://cryptodemonz.com/">Powered by Crypto Demonz</a>
            </footer>
          </Box>
        </div>
      </Grommet>
    </Container>
  );
}
