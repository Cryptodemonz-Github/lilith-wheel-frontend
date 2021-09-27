import {
  Box,
  RangeInput,
  Button,
  TextInput,
  FormField,
  Text,
  Heading,
} from "grommet";
import { React } from "react";
import "../styles/Home.module.css";
import WheelComponent from "./wheelComponent";

export default function PlaceBet(props) {
  const suggestionsBet = ["1k $LLTH", "10k $LLTH", "100k $LLTH"];

  const onSuggestionSelectBet = (event) => {
    switch (event.suggestion) {
      case "1k $LLTH":
        props.setValueBet(1000);
        break;
      case "10k $LLTH":
        props.setValueBet(10000);
        break;
      case "100k $LLTH":
        props.setValueBet(100000);
        break;
      default:
        props.setValueBet("");
    }
  };

  return (
    <Box
      direction="column"
      animation={{ type: "zoomIn", duration: 500, size: "xlarge" }}
    >
      <FormField name="betAmount">
        <TextInput
          required={true}
          suggestions={suggestionsBet}
          onSuggestionSelect={onSuggestionSelectBet}
          size="small"
          name="betAmount"
          placeholder="Bet Amount"
          value={props.valueBet}
          onChange={(event) => props.setValueBet(event.target.value)}
          icon={
            <Text color="#9933FF" size="medium">
              $LLTH
            </Text>
          }
          reverse
        />
      </FormField>
      <FormField name="autoCashOut">
        <RangeInput
          min="2"
          max="13"
          value={props.multiplier}
          onChange={(value) => {
            props.setMultiplier(value.target.value);
          }}
        />
        <Heading color="#fff" textAlign="center">
          {props.multiplier + "x"}
        </Heading>
      </FormField>

      <Button
        alignSelf="center"
        secondary
        type="submit"
        label={
          <Text align="center" size="xlarge" color="#fff">
            PLACE BET
          </Text>
        }
        color="#9933FF"
        onClick={() => props.placeBet()}
      />
    </Box>
  );
}
