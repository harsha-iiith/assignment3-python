import React from "react";
import styled from "styled-components";
import { theme } from "../../styles/theme";
import { Container, Flex } from "../../styles/GlobalStyles";

const HeaderContainer = styled.header`
  background: ${theme.colors.surface};
  box-shadow: ${theme.shadows.md};
  position: sticky;
  top: 0;
  z-index: ${theme.zIndex.sticky};
  padding: ${theme.spacing[4]} 0;
`;

const Logo = styled.h1`
  font-family: ${theme.fonts.heading};
  font-size: ${theme.fontSizes["2xl"]};
  font-weight: ${theme.fontWeights.bold};
  color: ${theme.colors.primary};
  margin: 0;

  span {
    color: ${theme.colors.secondary};
  }
`;

const Navigation = styled.nav`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[6]};
`;

const NavLink = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.text};
  font-size: ${theme.fontSizes.md};
  font-weight: ${theme.fontWeights.medium};
  padding: ${theme.spacing[2]} ${theme.spacing[4]};
  border-radius: ${theme.borderRadius.md};
  cursor: pointer;
  transition: all ${theme.transitions.fast};

  &:hover {
    background: ${theme.colors.background};
    color: ${theme.colors.primary};
  }

  ${(props) =>
    props.active &&
    `
    background: ${theme.colors.primary};
    color: white;
    
    &:hover {
      background: ${theme.colors.primary};
      opacity: 0.9;
    }
  `}
`;

const RoleIndicator = styled.div`
  background: ${(props) =>
    props.role === "instructor"
      ? theme.colors.primary
      : theme.colors.secondary};
  color: white;
  padding: ${theme.spacing[2]} ${theme.spacing[4]};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.medium};
  text-transform: capitalize;
`;

const SessionInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.muted};
`;

const SessionId = styled.span`
  background: ${theme.colors.background};
  padding: ${theme.spacing[1]} ${theme.spacing[3]};
  border-radius: ${theme.borderRadius.md};
  font-family: ${theme.fonts.monospace};
  font-weight: ${theme.fontWeights.medium};
  color: ${theme.colors.text};
  cursor: pointer;
  transition: all ${theme.transitions.fast};

  &:hover {
    background: ${theme.colors.primary}20;
  }
`;

const Header = ({
  userRole,
  currentSession,
  currentCourse,
  onRoleChange,
  onSessionEnd,
  onCopySessionId,
}) => {
  const handleCopySessionId = () => {
    if (currentSession && onCopySessionId) {
      onCopySessionId(currentSession.sessionId);
    }
  };

  return (
    <HeaderContainer>
      <Container>
        <Flex justify="space-between" align="center">
          <Logo>
            Vidya<span>Vichara</span>
          </Logo>

          <Flex align="center" gap={4}>
            {currentSession && (
              <SessionInfo>
                <span>Session:</span>
                <SessionId
                  onClick={handleCopySessionId}
                  title="Click to copy session ID"
                >
                  {currentSession.sessionId}
                </SessionId>
                {currentCourse && <span>| {currentCourse.title}</span>}
              </SessionInfo>
            )}

            <Navigation>
              {userRole && (
                <>
                  <RoleIndicator role={userRole}>{userRole}</RoleIndicator>

                  {currentSession && userRole === "instructor" && (
                    <NavLink onClick={onSessionEnd}>End Session</NavLink>
                  )}

                  <NavLink onClick={() => onRoleChange(null)}>
                    Switch Role
                  </NavLink>
                </>
              )}
            </Navigation>
          </Flex>
        </Flex>
      </Container>
    </HeaderContainer>
  );
};

export default Header;
