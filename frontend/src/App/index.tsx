import { styled } from "@mui/material/styles";
import Container from "@mui/material/Container";
import { QueryClientProvider } from "react-query";
import Router from "./router";
import { queryClient } from "./services";
import Navbar from "./Components/Navbar";

const ContainerStyled = styled(Container)`
  && {
    padding-top: 10px;
    margin-top: 100px;
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
