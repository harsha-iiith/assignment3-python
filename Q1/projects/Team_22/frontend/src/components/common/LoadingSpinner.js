import React from "react";
import styled from "styled-components";
import { LoadingSpinner } from "../../styles/GlobalStyles";
import { spin } from "../../styles/GlobalStyles";
import { theme } from "../../styles/theme";

const SpinnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing[8]};

  ${(props) =>
    props.fullScreen &&
    `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.9);
    z-index: ${theme.zIndex.modal};
  `}
`;

const SpinnerText = styled.p`
  margin-top: ${theme.spacing[4]};
  color: ${theme.colors.muted};
  font-size: ${theme.fontSizes.sm};
  text-align: center;
`;

const Spinner = styled.div`
  width: ${(props) => props.size || "40px"};
  height: ${(props) => props.size || "40px"};
  border: 3px solid ${theme.colors.background};
  border-top: 3px solid ${(props) => props.color || theme.colors.primary};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const LoadingComponent = ({
  size = "40px",
  color,
  text = "Loading...",
  fullScreen = false,
  className,
}) => {
  return (
    <SpinnerContainer fullScreen={fullScreen} className={className}>
      <Spinner size={size} color={color} />
      {text && <SpinnerText>{text}</SpinnerText>}
    </SpinnerContainer>
  );
};

export default LoadingComponent;
