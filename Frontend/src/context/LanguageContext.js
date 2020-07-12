import React, { createContext, Component } from "react";
import English from "../util/Languages/English";
import German from "../util/Languages/German";

export const LanguageContext = createContext();

class LanguageContextProvider extends Component {
  state = {
    isEnglish: true,
    english: English,
    german: German,
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
