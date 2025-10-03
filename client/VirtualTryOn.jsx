import styled from 'styled-components';
import VirtualTryOn from './VirtualTryOn';

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background: ${({ theme }) => theme.bg};
`;

const VirtualTryOnPage = () => {
  return (
    <Container>
      <VirtualTryOn />
    </Container>
  );
};

export default VirtualTryOnPage;