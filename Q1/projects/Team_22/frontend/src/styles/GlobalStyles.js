import styled, { createGlobalStyle, keyframes } from "styled-components";
import { theme } from "./theme";

// Global styles
export const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    font-size: 16px;
    scroll-behavior: smooth;
  }

  body {
    font-family: ${theme.fonts.primary};
    font-size: ${theme.fontSizes.md};
    line-height: ${theme.lineHeights.normal};
    color: ${theme.colors.text};
    background-color: ${theme.colors.background};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: ${theme.fonts.heading};
    font-weight: ${theme.fontWeights.semibold};
    line-height: ${theme.lineHeights.tight};
    margin-bottom: ${theme.spacing[4]};
  }

  h1 {
    font-size: ${theme.fontSizes["4xl"]};
  }

  h2 {
    font-size: ${theme.fontSizes["3xl"]};
  }

  h3 {
    font-size: ${theme.fontSizes["2xl"]};
  }

  h4 {
    font-size: ${theme.fontSizes.xl};
  }

  h5 {
    font-size: ${theme.fontSizes.lg};
  }

  h6 {
    font-size: ${theme.fontSizes.md};
  }

  p {
    margin-bottom: ${theme.spacing[4]};
  }

  a {
    color: ${theme.colors.primary};
    text-decoration: none;
    transition: color ${theme.transitions.fast};

    &:hover {
      color: ${theme.colors.primary};
      opacity: 0.8;
    }
  }

  button {
    font-family: inherit;
    cursor: pointer;
    border: none;
    background: none;
    transition: all ${theme.transitions.fast};

    &:focus {
      outline: 2px solid ${theme.colors.primary};
      outline-offset: 2px;
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }
  }

  input, textarea, select {
    font-family: inherit;
    font-size: inherit;
    border: 1px solid #ddd;
    border-radius: ${theme.borderRadius.md};
    padding: ${theme.spacing[3]};
    transition: border-color ${theme.transitions.fast};

    &:focus {
      outline: none;
      border-color: ${theme.colors.primary};
      box-shadow: 0 0 0 2px ${theme.colors.primary}20;
    }

    &:disabled {
      background-color: #f5f5f5;
      cursor: not-allowed;
    }
  }

  textarea {
    resize: vertical;
    min-height: 80px;
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
`;

// Animation keyframes
export const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

export const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export const bounce = keyframes`
  0%, 20%, 53%, 80%, 100% {
    transform: translate3d(0, 0, 0);
  }
  40%, 43% {
    transform: translate3d(0, -10px, 0);
  }
  70% {
    transform: translate3d(0, -5px, 0);
  }
  90% {
    transform: translate3d(0, -2px, 0);
  }
`;

export const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

export const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const stickyNotePeel = keyframes`
  0% {
    transform: rotateX(0deg) rotateY(0deg);
  }
  25% {
    transform: rotateX(-2deg) rotateY(2deg);
  }
  50% {
    transform: rotateX(2deg) rotateY(-2deg);
  }
  75% {
    transform: rotateX(-1deg) rotateY(1deg);
  }
  100% {
    transform: rotateX(0deg) rotateY(0deg);
  }
`;

// Common styled components
export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${theme.spacing[4]};

  @media (min-width: ${theme.breakpoints.lg}) {
    padding: 0 ${theme.spacing[6]};
  }
`;

export const Card = styled.div`
  background: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.md};
  padding: ${theme.spacing[6]};
  margin-bottom: ${theme.spacing[4]};

  &:hover {
    box-shadow: ${theme.shadows.lg};
  }
`;

export const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing[3]} ${theme.spacing[6]};
  font-size: ${theme.fontSizes.md};
  font-weight: ${theme.fontWeights.medium};
  line-height: 1;
  border-radius: ${theme.borderRadius.md};
  transition: all ${theme.transitions.fast};
  cursor: pointer;
  text-decoration: none;

  ${(props) => {
    switch (props.variant) {
      case "primary":
        return `
          background-color: ${theme.colors.primary};
          color: white;
          
          &:hover:not(:disabled) {
            background-color: ${theme.colors.primary};
            opacity: 0.9;
            transform: translateY(-1px);
          }
        `;
      case "secondary":
        return `
          background-color: ${theme.colors.secondary};
          color: white;
          
          &:hover:not(:disabled) {
            background-color: ${theme.colors.secondary};
            opacity: 0.9;
          }
        `;
      case "success":
        return `
          background-color: ${theme.colors.success};
          color: white;
          
          &:hover:not(:disabled) {
            background-color: ${theme.colors.success};
            opacity: 0.9;
          }
        `;
      case "danger":
        return `
          background-color: ${theme.colors.danger};
          color: white;
          
          &:hover:not(:disabled) {
            background-color: ${theme.colors.danger};
            opacity: 0.9;
          }
        `;
      case "outline":
        return `
          background-color: transparent;
          color: ${theme.colors.primary};
          border: 1px solid ${theme.colors.primary};
          
          &:hover:not(:disabled) {
            background-color: ${theme.colors.primary};
            color: white;
          }
        `;
      default:
        return `
          background-color: ${theme.colors.surface};
          color: ${theme.colors.text};
          border: 1px solid #ddd;
          
          &:hover:not(:disabled) {
            background-color: #f8f9fa;
          }
        `;
    }
  }}

  ${(props) =>
    props.size === "sm" &&
    `
    padding: ${theme.spacing[2]} ${theme.spacing[4]};
    font-size: ${theme.fontSizes.sm};
  `}
  
  ${(props) =>
    props.size === "lg" &&
    `
    padding: ${theme.spacing[4]} ${theme.spacing[8]};
    font-size: ${theme.fontSizes.lg};
  `}
  
  ${(props) => props.fullWidth && "width: 100%;"}
`;

export const Input = styled.input`
  width: 100%;
  padding: ${theme.spacing[3]};
  border: 1px solid #ddd;
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.fontSizes.md};
  transition: border-color ${theme.transitions.fast};

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 2px ${theme.colors.primary}20;
  }

  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }

  ${(props) =>
    props.error &&
    `
    border-color: ${theme.colors.danger};
    
    &:focus {
      border-color: ${theme.colors.danger};
      box-shadow: 0 0 0 2px ${theme.colors.danger}20;
    }
  `}
`;

export const Textarea = styled.textarea`
  width: 100%;
  padding: ${theme.spacing[3]};
  border: 1px solid #ddd;
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.fontSizes.md};
  resize: vertical;
  min-height: 80px;
  transition: border-color ${theme.transitions.fast};

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 2px ${theme.colors.primary}20;
  }

  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }

  ${(props) =>
    props.error &&
    `
    border-color: ${theme.colors.danger};
    
    &:focus {
      border-color: ${theme.colors.danger};
      box-shadow: 0 0 0 2px ${theme.colors.danger}20;
    }
  `}
`;

export const Label = styled.label`
  display: block;
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.medium};
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing[2]};
`;

export const ErrorText = styled.div`
  color: ${theme.colors.danger};
  font-size: ${theme.fontSizes.sm};
  margin-top: ${theme.spacing[1]};
`;

export const SuccessText = styled.div`
  color: ${theme.colors.success};
  font-size: ${theme.fontSizes.sm};
  margin-top: ${theme.spacing[1]};
`;

export const LoadingSpinner = styled.div`
  width: ${(props) => props.size || "24px"};
  height: ${(props) => props.size || "24px"};
  border: 2px solid ${(props) => props.color || theme.colors.primary}20;
  border-top: 2px solid ${(props) => props.color || theme.colors.primary};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin: ${(props) => (props.centered ? "0 auto" : "0")};
`;

export const Flex = styled.div`
  display: flex;

  ${(props) => props.direction && `flex-direction: ${props.direction};`}
  ${(props) => props.align && `align-items: ${props.align};`}
  ${(props) => props.justify && `justify-content: ${props.justify};`}
  ${(props) => props.wrap && `flex-wrap: ${props.wrap};`}
  ${(props) => props.gap && `gap: ${theme.spacing[props.gap]};`}
`;

export const Grid = styled.div`
  display: grid;

  ${(props) =>
    props.columns && `grid-template-columns: repeat(${props.columns}, 1fr);`}
  ${(props) => props.gap && `gap: ${theme.spacing[props.gap]};`}
  
  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

export default GlobalStyles;
