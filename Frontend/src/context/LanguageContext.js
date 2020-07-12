import React, { createContext, Component } from "react";

export const LanguageContext = createContext();

class LanguageContextProvider extends Component {
  state = {
    isEnglish: true,
    english: {
      login: {
        pageTitle: "Login | Twirrer",
        header: "Log in to Twirrer",
        emailLabel: "Email address",
        passwordLabel: "Password",
        logInButton: "Log in",
        loading: "Loading...",
        question: "Don't have an account?",
        link: "Sign up for Twirrer",
      },
      signup: {
        pageTitle: "Signup | Twirrer",
        header: "Sign up for Twirrer",
        userNameLabel: "User name",
        emailLabel: "Email address",
        passwordLabel: "Password",
        confirmPasswordLabel: "Confirm Password",
        signupButton: "Sign up",
        loading: "Loading...",
        question: "Already have an account?",
        link: "login to Twirrer",
      },
    },

    german: {
      login: {
        pageTitle: "Anmeldung | Twirrer",
        header: "Melden Sie sich bei Twirrer an",
        emailLabel: "E-Mail Adresse",
        passwordLabel: "Passwort",
        logInButton: "Anmeldung",
        loading: "Wird geladen...",
        question: "Haben Sie kein Konto?",
        link: "Melden Sie sich für Twitter an",
      },
      signup: {
        pageTitle: "Signup | Twirrer",
        header: "Melden Sie sich für Twirrer an",
        userNameLabel: "Nutzername",
        emailLabel: "E-Mail Adresse",
        passwordLabel: "Passwort",
        confirmPasswordLabel: "Bestätige das Passwort",
        signupButton: "Anmelden",
        loading: "Wird geladen...",
        question: "Sie haben bereits ein Konto?",
        link: "Melden Sie sich bei Twirrer an",
      },
    },
  };

  toggleLanguage = () => {
    this.setState({ isEnglish: !this.state.isEnglish });
  };
  render() {
    return (
      // pass state and fun to whole app
      <LanguageContext.Provider
        value={{ ...this.state, toggleLanguage: this.toggleLanguage }}
      >
        {this.props.children}
      </LanguageContext.Provider>
    );
  }
}

export default LanguageContextProvider;
