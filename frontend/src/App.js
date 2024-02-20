import React, { useState, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
//import { decode } from "jsonwebtoken";
import { decode } from './common/decoder';
import useLocalStorage from "./hooks/useLocalStorage";
import Navbar from "./routes/Navbar";
import Routes from "./routes/Routes";
import LoadingSpinner from "./common/LoadingSpinner";
import GanzkorperApi from "./api/api";
import UserContext from "./auth/UserContext";

// Key name for storing token in localStorage for "remember me" re-login
export const TOKEN_STORAGE_ID = "ganzkorper-token";

/** Jobly application */
function App() {
  const [infoLoaded, setInfoLoaded] = useState(false);
  const [applicationIds, setApplicationIds] = useState(new Set([]));
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useLocalStorage(TOKEN_STORAGE_ID);
  
  useEffect(function loadUserInfo() {
    async function getCurrentUser() {
      if (token) {
        try {
          let { username } = decode(token);
          // put the token on the Api class so it can use it to call the API.
          GanzkorperApi.token = token;
          let currentUser = username;
          setCurrentUser(currentUser);
          setApplicationIds(new Set(currentUser.applications));
        } catch (err) {
          console.error("App loadUserInfo: problem loading", err);
          setCurrentUser(null);
        }
      }
      setInfoLoaded(true);
    }

    setInfoLoaded(false);
    getCurrentUser();
  }, [token]);

  async function login(loginData) {
    try {
      let token = await GanzkorperApi.login(loginData);
      setToken(token);
      return { success: true };
    } catch (errors) {
      console.error("login failed", errors);
      return { success: false, errors };
    }
  }

  /** Handles site-wide logout. */
  function logout() {
    setCurrentUser(null);
    setToken(null);
  }

  async function signup(signupData) {
    try {
      let token = await GanzkorperApi.signup(signupData);
      setToken(token);
      return { success: true };
    } catch (errors) {
      console.error("signup failed", errors);
      return { success: false, errors };
    }
  }

  //write additional functions here to add more features later on
  //update history; add missing workout to database; among others!

  if (!infoLoaded) return <LoadingSpinner />;

  return (
    <BrowserRouter>
        <UserContext.Provider
            //additonal function calls should be passed in here after setCurrentUser 
            value={{ currentUser, setCurrentUser }}>
          <div className="App">
            <Navbar logout={logout} />
            <Routes login={login} signup={signup} />
          </div>
        </UserContext.Provider>
      </BrowserRouter>
  );
}

export default App;