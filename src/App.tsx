import React from 'react'
import { DAppProvider, Rinkeby} from "@usedapp/core"
import { Header } from "./components/Header"
import { Container } from "@material-ui/core"
import { Main } from "./components/Main"
import Providers from "./components/providers"
import Users from "./components/users"
import { HashRouter, Routes, Route, Navigate} from "react-router-dom";

//navigate to the right
function ProtectedRouteUsers(props:any){
  const isAuthenticated = localStorage.getItem("isAuthenticatedUser");
  return isAuthenticated === "true" ? <Users/> : <Navigate to="/" replace />;
}

function ProtectedRouteProviders(props:any){
  const isAuthenticated = localStorage.getItem("isAuthenticatedProvider");
  return isAuthenticated === "true" ? <Providers/> : <Navigate to="/" replace />;
}

function App() {

  return (
    
    <DAppProvider config={{
      readOnlyChainId: Rinkeby.chainId,
      notifications: {
        expirationPeriod: 1000,
        checkInterval: 1000
      }
    }}>
      <Header />
      <Container maxWidth="md">
      <HashRouter>
      <Routes>
              <Route path="/" element={<Main/>}/>
              <Route
                      path="/providers"
                      element={
                        <ProtectedRouteProviders>
                          <Providers />
                        </ProtectedRouteProviders>
                      }
                    />

              <Route
                      path="/users"
                      element={
                        <ProtectedRouteUsers>
                          <Users/>
                        </ProtectedRouteUsers>
                      }
                    />
              
      </Routes>

      </HashRouter>
      </Container>
    </DAppProvider>
  )
}

export default App