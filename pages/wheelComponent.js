import React, { useEffect } from "react";
import wheelImg from "../styles/assets/wheel.png";
import markerImg from "../styles/assets/marker.png";
import { Box, Stack } from "grommet";
import Image from "next/image";
import "../styles/Home.module.css";
import { useSpring, animated } from "react-spring";
import * as easings from "d3-ease";
import { useState } from "react";
import styled, { css } from "styled-components";

const WheelImage = styled(Image)`
  ${({ value }) =>
    value &&
    `
  filter: blur(1px);
 `}
`;

function timeout(delay) {
  return new Promise((res) => setTimeout(res, delay));
}
const wait = async (props) => {
  await timeout(1500);
  props.setIsEnded(true);
};

function WheelComponent(props) {
  const animations = useSpring(
    props.isSpinning
      ? {
          from: { rotateZ: 0 },
          to: { rotateZ: props.rotateValue },
          config: {
            mass: 10000,
            duration: 15000,
            easing: easings.easeQuadOut,
          },
          reset: true,
          onRest: () => {
            props.setIsSpinning(false);
            wait(props);
          },
        }
      : {}
  );

  useEffect(() => {
    console.log("winningMulti in wheelc: ", props.winningMultiplier);
  }, []);

  return (
    <>
      <Box direction="column" gap="medium">
        <Box height="medium" width="medium" margin="0px">
          <Stack anchor="top">
            <animated.div
              style={{
                width: 390,
                height: 390,
                borderRadius: 16,
                ...animations,
              }}
            >
              <Box
                animation={[
                  { type: "zoomIn", duration: 450, size: "xlarge" },
                  { type: "fadeIn", duration: 1000, size: "xlarge" },
                ]}
              >
                <WheelImage
                  className="wheelImg"
                  value={props.isSpinning}
                  src={wheelImg}
                  width={500}
                  height={500}
                />
              </Box>
            </animated.div>

            <Box
              height="100px"
              width="40px"
              margin={{ top: "-20px", left: "10px" }}
            >
              <Image className="marker" fit="cover" src={markerImg} />
            </Box>
          </Stack>
        </Box>
      </Box>
    </>
  );
}

export default WheelComponent;
