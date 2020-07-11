import React, { createContext, Component } from "react";

export const ThemeContext = createContext();

class ThemeContextProvider extends Component {
  state = {
    isLightTheme: false,
    dark: {
      mainColor: "#1DA1F2",
      secondaryColor: "rgba(29, 161, 242, 0.1)",
      background: "#15202B",
      error: "#E0245E",
      foreground: "#192734",
      typoMain: "#ffffff",
      typoSecondary: "#8899A6",
      logo: "#ffffff",
    },

    light: {
      mainColor: "#1DA1F2",
      secondaryColor: "rgba(29, 161, 242, 0.1)",
      background: "#ffffff",
      error: "#E0245E",
      foreground: "#F5F8FA",
      typoMain: "#14171A",
      typoSecondary: "#657786",
      logo: "#1DA1F2",
    },
  };

  toggleTheme = () => {
    this.setState({ isLightTheme: !this.state.isLightTheme });
  };
  render() {
    return (
      // pass state and fun to whole app
      <ThemeContext.Provider
        value={{ ...this.state, toggleTheme: this.toggleTheme }}
      >
        {this.props.children}
      </ThemeContext.Provider>
    );
  }
}

export default ThemeContextProvider;
