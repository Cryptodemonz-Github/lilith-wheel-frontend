import React from "react";
import "../styles/Home.module.css";
import { Button, Text, Box } from "grommet";

function BottomButtons(props) {
  const connect = async () => {
    const accs = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    props.setAccounts(accs);
  };

  return (
    <>
      {props.placedBet ? (
        <>
          {!props.isSpinning && !props.isEnded ? (
            <Box animation="pulse">
              <Button
                alignSelf="center"
                secondary
                type="submit"
                label={
                  <Text align="center" size="xlarge" color="#fff">
                    SPIN
                  </Text>
                }
                color="#9933FF"
                onClick={() => props.setIsSpinning(true)}
              />
            </Box>
          ) : (
            <Button
              alignSelf="center"
              secondary
              type="submit"
              label={
                <Text align="center" size="xlarge" color="#fff">
                  SPIN
                </Text>
              }
              color="#9933FF"
              onClick={() => props.setIsSpinning(true)}
            />
          )}
        </>
      ) : (
        <>
          {props.connected ? (
            <Button
              alignSelf="center"
              secondary
              type="submit"
              label={
                <Text align="center" size="xlarge" color="#fff">
                  START
                </Text>
              }
              color="#9933FF"
              onClick={() => props.setIsTxModalOpen(true)}
            />
          ) : (
            <Box animation="pulse">
              <Button
                secondary
                alignSelf="center"
                type="submit"
                label={
                  <Text size="xlarge" color="#fff">
                    CONNECT
                  </Text>
                }
                onClick={() => connect()}
                color="#9933FF"
              />{" "}
            </Box>
          )}
        </>
      )}
    </>
  );
}

export default BottomButtons;
