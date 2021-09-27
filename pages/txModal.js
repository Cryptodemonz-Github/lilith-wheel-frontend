import React from "react";
import "../styles/Home.module.css";
import { Box, Text } from "grommet";
import Spinner from "./spinner";
import PlaceBet from "./placeBet";
import styled from "styled-components";

const ModalContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(5px);
`;

function TxModal(props) {
  return (
    <ModalContainer>
      <Box
        height="medium"
        width="medium"
        pad="medium"
        background="#000"
        justify="center"
        animation={{ type: "fadeIn", duration: 750, size: "xlarge" }}
      >
        {props.txStarted ? (
          <Box
            direction="column"
            gap="medium"
            align="center"
            animation={{ type: "fadeIn", duration: 500, size: "xlarge" }}
          >
            <Text textAlign="center" size="xxlarge">
              Waiting for transaction...
            </Text>
            <Spinner />
          </Box>
        ) : (
          <>
            <PlaceBet
              valueBet={props.valueBet}
              setValueBet={props.setValueBet}
              multiplier={props.multiplier}
              setMultiplier={props.setMultiplier}
              connected={props.connected}
              setConnected={props.setConnected}
              placeBet={props.placeBet}
              setTxStarted={props.setTxStarted}
              txStarted={props.txStarted}
            />
          </>
        )}
      </Box>
    </ModalContainer>
  );
}

export default TxModal;
