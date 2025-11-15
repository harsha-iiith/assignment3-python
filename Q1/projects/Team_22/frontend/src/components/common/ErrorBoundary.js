import React, { Component } from "react";
import styled from "styled-components";
import { theme } from "../../styles/theme";
import { Button } from "../../styles/GlobalStyles";

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: ${theme.spacing[8]};
  text-align: center;
`;

const ErrorIcon = styled.div`
  font-size: 4rem;
  margin-bottom: ${theme.spacing[4]};
`;

const ErrorTitle = styled.h2`
  color: ${theme.colors.danger};
  margin-bottom: ${theme.spacing[4]};
`;

const ErrorMessage = styled.p`
  color: ${theme.colors.muted};
  margin-bottom: ${theme.spacing[6]};
  max-width: 500px;
`;

const ErrorDetails = styled.details`
  margin-top: ${theme.spacing[4]};
  padding: ${theme.spacing[4]};
  background: ${theme.colors.background};
  border-radius: ${theme.borderRadius.md};
  width: 100%;
  max-width: 600px;

  summary {
    cursor: pointer;
    font-weight: ${theme.fontWeights.medium};
    margin-bottom: ${theme.spacing[2]};
  }

  pre {
    background: ${theme.colors.surface};
    padding: ${theme.spacing[3]};
    border-radius: ${theme.borderRadius.sm};
    overflow-x: auto;
    font-size: ${theme.fontSizes.sm};
    color: ${theme.colors.text};
  }
`;

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });

    // Log error to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    // In production, you might want to log this to an error reporting service
    // logErrorToService(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorContainer>
          <ErrorIcon>😵</ErrorIcon>
          <ErrorTitle>Oops! Something went wrong</ErrorTitle>
          <ErrorMessage>
            We're sorry, but something unexpected happened. Please try
            refreshing the page or contact support if the problem persists.
          </ErrorMessage>

          <div>
            <Button
              variant="primary"
              onClick={this.handleRetry}
              style={{ marginRight: theme.spacing[3] }}
            >
              Try Again
            </Button>
            <Button variant="outline" onClick={this.handleReload}>
              Reload Page
            </Button>
          </div>

          {process.env.NODE_ENV === "development" && this.state.error && (
            <ErrorDetails>
              <summary>Error Details (Development)</summary>
              <pre>
                {this.state.error && this.state.error.toString()}
                <br />
                {this.state.errorInfo.componentStack}
              </pre>
            </ErrorDetails>
          )}
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
