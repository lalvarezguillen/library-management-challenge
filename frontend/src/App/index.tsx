import { styled } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Router from './router';

const ContainerStyled = styled(Container)`
  && {
    padding-top: 10px;
    margin-top: 100px;
  }
`;
function App() {
  return (
    <div className="App">
      <ContainerStyled maxWidth="md">
        <Router />
      </ContainerStyled>
    </div>
  );
}

export default App;
