import React, { useEffect } from "react";
import demonzface from "../styles/assets/demonzface.png";
import demonzface_b from "../styles/assets/demonzface_b.png";
import won from "../styles/assets/won.png";
import Image from "next/image";
import "../styles/Home.module.css";
import { Box, Button, Text } from "grommet";
import styled, { css } from "styled-components";

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

function ResultModal(props) {
  const newGame = () => {
    props.setValueBet(undefined);
    props.setMultiplier(2);
    props.setWinningMultiplier(undefined);
    props.setPlacedBet(false);
    props.setTxStarted(false);
    props.setIsEnded(false);
    props.setWon(false);
    props.setReset(!props.reset);
  };

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
        {!props.won ? (
          <Box
            direction="column"
            gap="medium"
            align="center"
            animation={{ type: "zoomIn", duration: 500, size: "xlarge" }}
          >
            <Text textAlign="center" size="xxlarge">
              YOU LOST!
            </Text>
            <Image
              className="wheel"
              height="100px"
              width="100px"
              src={demonzface_b}
            />

            <Text textAlign="center" size="medium">
              TRY AGAIN!
            </Text>

            <Button
              alignSelf="center"
              secondary
              type="submit"
              label={
                <Text align="center" size="large" color="#fff">
                  NEW GAME
                </Text>
              }
              color="#9933FF"
              onClick={() => newGame()}
            />
          </Box>
        ) : (
          <Box
            direction="column"
            gap="medium"
            align="center"
            animation={{ type: "zoomIn", duration: 500, size: "xlarge" }}
          >
            <Text textAlign="center" size="xxlarge">
              YOU WON!
            </Text>
            <Image className="wheel" height="100px" width="100px" src={won} />

            <Text size="large">
              {props.valueBet * props.winningMultiplier}{" "}
              <Text color="#9933FF" size="large">
                $LLTH
              </Text>
            </Text>
            <Text textAlign="center" size="small">
              YOU WILL RECEIVE YOUR PRIZE WITHIN A FEW SECONDS.
            </Text>

            <Button
              alignSelf="center"
              secondary
              type="submit"
              label={
                <Text align="center" size="large" color="#fff">
                  NEW GAME
                </Text>
              }
              color="#9933FF"
              onClick={() => newGame()}
            />
          </Box>
        )}
      </Box>
    </ModalContainer>
  );
}

export default ResultModal;
