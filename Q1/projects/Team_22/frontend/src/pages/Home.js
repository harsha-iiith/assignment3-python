import React from "react";
import styled from "styled-components";
import { theme } from "../styles/theme";
import { Container, Button, Card } from "../styles/GlobalStyles";
import { USER_ROLES } from "../utils/constants";

const HomeContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(
    135deg,
    ${theme.colors.primary}10,
    ${theme.colors.secondary}10
  );
`;

const HeroSection = styled.section`
  flex: 1;
  display: flex;
  align-items: center;
  padding: ${theme.spacing[12]} 0;
`;

const HeroContent = styled.div`
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: ${theme.fontSizes["4xl"]};
  font-weight: ${theme.fontWeights.bold};
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing[4]};

  span {
    color: ${theme.colors.primary};
  }

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${theme.fontSizes["3xl"]};
  }
`;

const Subtitle = styled.p`
  font-size: ${theme.fontSizes.xl};
  color: ${theme.colors.muted};
  margin-bottom: ${theme.spacing[8]};
  line-height: ${theme.lineHeights.relaxed};

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${theme.fontSizes.lg};
  }
`;

const RoleSelection = styled.div`
  display: grid;
  gap: ${theme.spacing[6]};
  margin-bottom: ${theme.spacing[12]};

  @media (min-width: ${theme.breakpoints.md}) {
    grid-template-columns: 1fr 1fr;
    max-width: 600px;
    margin: 0 auto ${theme.spacing[12]} auto;
  }
`;

const RoleCard = styled(Card)`
  text-align: center;
  padding: ${theme.spacing[8]};
  cursor: pointer;
  transition: all ${theme.transitions.normal};
  border: 2px solid transparent;

  &:hover {
    transform: translateY(-4px);
    border-color: ${(props) =>
      props.primary ? theme.colors.primary : theme.colors.secondary};
  }

  .icon {
    font-size: 4rem;
    margin-bottom: ${theme.spacing[4]};
  }

  h3 {
    font-size: ${theme.fontSizes["2xl"]};
    margin-bottom: ${theme.spacing[3]};
    color: ${(props) =>
      props.primary ? theme.colors.primary : theme.colors.secondary};
  }

  p {
    color: ${theme.colors.muted};
    margin-bottom: ${theme.spacing[6]};
  }
`;

const FeatureSection = styled.section`
  padding: ${theme.spacing[12]} 0;
  background: ${theme.colors.surface};
`;

const FeatureGrid = styled.div`
  display: grid;
  gap: ${theme.spacing[8]};

  @media (min-width: ${theme.breakpoints.md}) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const FeatureCard = styled.div`
  text-align: center;

  .icon {
    font-size: 3rem;
    margin-bottom: ${theme.spacing[4]};
  }

  h4 {
    font-size: ${theme.fontSizes.xl};
    margin-bottom: ${theme.spacing[3]};
    color: ${theme.colors.text};
  }

  p {
    color: ${theme.colors.muted};
    line-height: ${theme.lineHeights.relaxed};
  }
`;

const Footer = styled.footer`
  background: ${theme.colors.text};
  color: white;
  padding: ${theme.spacing[6]} 0;
  text-align: center;
  margin-top: auto;
`;

const Home = ({ onRoleSelect }) => {
  const handleRoleSelect = (role) => {
    onRoleSelect(role);
  };

  return (
    <HomeContainer>
      <HeroSection>
        <Container>
          <HeroContent>
            <Title>
              Welcome to <span>VidyaVichara</span>
            </Title>
            <Subtitle>
              Transform your classroom with real-time Q&A sessions. Students ask
              questions as sticky notes, instructors manage and respond
              efficiently.
            </Subtitle>

            <RoleSelection>
              <RoleCard
                primary
                onClick={() => handleRoleSelect(USER_ROLES.INSTRUCTOR)}
              >
                <div className="icon">👨‍🏫</div>
                <h3>I'm an Instructor</h3>
                <p>
                  Create courses, start sessions, and manage student questions
                  in real-time
                </p>
                <Button variant="primary" size="lg" fullWidth>
                  Get Started
                </Button>
              </RoleCard>

              <RoleCard onClick={() => handleRoleSelect(USER_ROLES.STUDENT)}>
                <div className="icon">🎓</div>
                <h3>I'm a Student</h3>
                <p>
                  Join sessions, ask questions, and engage with classroom
                  discussions
                </p>
                <Button variant="secondary" size="lg" fullWidth>
                  Join Session
                </Button>
              </RoleCard>
            </RoleSelection>
          </HeroContent>
        </Container>
      </HeroSection>

      <FeatureSection>
        <Container>
          <h2 style={{ textAlign: "center", marginBottom: theme.spacing[8] }}>
            Why Choose VidyaVichara?
          </h2>

          <FeatureGrid>
            <FeatureCard>
              <div className="icon">📝</div>
              <h4>Sticky Note Interface</h4>
              <p>
                Questions appear as colorful sticky notes, making it easy to
                visualize and organize classroom engagement.
              </p>
            </FeatureCard>

            <FeatureCard>
              <div className="icon">⚡</div>
              <h4>Real-time Updates</h4>
              <p>
                Questions and status changes appear instantly, keeping everyone
                in sync during live sessions.
              </p>
            </FeatureCard>

            <FeatureCard>
              <div className="icon">🎯</div>
              <h4>Smart Organization</h4>
              <p>
                Filter and categorize questions by status, importance, and
                student to manage large classes effectively.
              </p>
            </FeatureCard>

            <FeatureCard>
              <div className="icon">👥</div>
              <h4>Student-Centric</h4>
              <p>
                Students can ask questions without interrupting the flow,
                encouraging more participation.
              </p>
            </FeatureCard>

            <FeatureCard>
              <div className="icon">📊</div>
              <h4>Session Analytics</h4>
              <p>
                Track question patterns, response times, and student engagement
                for better teaching insights.
              </p>
            </FeatureCard>

            <FeatureCard>
              <div className="icon">🔒</div>
              <h4>Secure & Private</h4>
              <p>
                Each session has a unique ID, ensuring only intended
                participants can join your classroom discussions.
              </p>
            </FeatureCard>
          </FeatureGrid>
        </Container>
      </FeatureSection>

      <Footer>
        <Container>
          <p>
            &copy; 2025 VidyaVichara. Empowering interactive learning through
            technology.
          </p>
        </Container>
      </Footer>
    </HomeContainer>
  );
};

export default Home;
