import React from "react";
import "../styles/Home.module.css";
import { Text } from "grommet";

function UnderHeaderText(props) {
  return (
    <>
      <br />
      {props.connected ? (
        <>
          {props.placedBet ? (
            <>
              <Text size="large">
                BET AMOUNT:
                <Text color="#9933FF" size="large">
                  {" "}
                  {props.valueBet} $LLTH
                </Text>
                <Text size="large">
                  {" "}
                  MULTIPLIER:{" "}
                  <Text color="#9933FF" size="large">
                    {" "}
                    {props.multiplier}x
                  </Text>{" "}
                </Text>
              </Text>
            </>
          ) : (
            <Text size="large">PLACE BET!</Text>
          )}
        </>
      ) : (
        <Text size="large">CONNECT YOUR WALLET TO PLAY!</Text>
      )}
    </>
  );
}

export default UnderHeaderText;
