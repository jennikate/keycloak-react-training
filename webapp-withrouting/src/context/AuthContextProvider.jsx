import Keycloak, { KeycloakConfig, KeycloakInitOptions } from "keycloak-js";
import { createContext, useEffect, useState } from "react";

/**
 * KeycloakConfig configures the connection to the Keycloak server.
 */
const keycloakConfig = {
  realm: "react-example",
  clientId: "webapp",
  url: "http://localhost:8080/auth",
};

/**
 * KeycloakInitOptions configures the Keycloak client.
 */
const keycloakInitOptions = {
  // Configure that Keycloak will check if a user is already authenticated (when opening the app or reloading the page). If not authenticated the user will be send to the login form. If already authenticated the webapp will open.
  onLoad: "login-required",
};

// Create the Keycloak client instance
const keycloak = Keycloak(keycloakConfig);

/**
 * Default values for the {@link AuthContext}
 */
const defaultAuthContextValues = {
  isAuthenticated: false,
  logout: () => { },
  username: '',
  hasRole: (role) => false,
};

/**
 * Create the AuthContext using the default values.
 */
export const AuthContext = createContext(
  defaultAuthContextValues
);

/**
 * AuthContextProvider is responsible for managing the authentication state of the current user.
 *
 * @param props
 */
const AuthContextProvider = (props) => {
  console.log("rendering AuthContextProvider");

  // Create the local state in which we will keep track if a user is authenticated
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const hasRole = (role) => {
    return keycloak.hasRealmRole(role);
  };

  const logout = () => {
    keycloak.logout();
  };

  const login = async ({ setLoading }) => {

    // const initializeKeycloak = async () => {
      console.log("initialize Keycloak");
      try {
        const isAuthenticatedResponse = await keycloak.init(
          keycloakInitOptions
        );

        if (!isAuthenticatedResponse) {
          console.log(
            "user is not yet authenticated. forwarding user to login."
          );
          keycloak.login();
          setLoading(false);
        }
        setAuthenticated(isAuthenticatedResponse);

      } catch {
        console.log("error initializing Keycloak");
        setAuthenticated(false);
      } finally {
        console.log('in finally')
        setLoading(false);
      }
    // }

    // initializeKeycloak();
  };

  useEffect(() => {
    /**
     * Load the profile for of the user from Keycloak
     */
    async function loadProfile() {
      try {
        const profile = await keycloak.loadUserProfile();
        if (profile.firstName) {
          setUsername(profile.firstName);
        } else if (profile.username) {
          setUsername(profile.username);
        }
      } catch {
        console.log("error trying to load the user profile");
      }
    }

    // Only load the profile if a user is authenticated
    if (isAuthenticated) {
      loadProfile();
    }
  }, [isAuthenticated]);

  console.log('isAuthenticated', isAuthenticated)
  return (
    <AuthContext.Provider value={{ hasRole, isAuthenticated, login, logout, username }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;