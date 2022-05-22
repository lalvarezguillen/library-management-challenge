import { styled } from "@mui/material/styles";
import Container from "@mui/material/Container";
import { QueryClientProvider } from "react-query";
import Router from "./router";
import { queryClient } from "./services";
import Navbar from "./Components/Navbar";

const ContainerStyled = styled(Container)`
  && {
    margin-top: 80px;
  }
`;

function App() {
  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
        <Navbar />
        <ContainerStyled maxWidth="md">
          <Router />
        </ContainerStyled>
      </QueryClientProvider>
    </div>
  );
}

export default App;
