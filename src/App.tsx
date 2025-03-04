import { RouterProvider } from "react-router-dom"
import router from "./router"
import { GlobalStyles } from "./styles/GlobalStyles.tsx"
import { useEffect, useState } from "react"
import LoadingScreen from "./components/LoadingScreen";
import { auth } from "./firebase";
import styled from "styled-components";

const Wrapper = styled.div`
height: 100vh;
display: flex;
justify-content: center;
`;

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const init = async () => {
    // wait for firebase
    await auth.authStateReady();
    setIsLoading(false);
    // setTimeout(() => setIsLoading(false), 2000);  // 일부로 로딩을 보기위해 2초 콜백 설정
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <Wrapper>
      <GlobalStyles />
      {isLoading ? <LoadingScreen /> : <RouterProvider router={router} />}
    </Wrapper>
  )
}

export default App
