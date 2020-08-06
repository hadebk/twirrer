import React, { createContext, Component } from "react";

// import data files
import Dark from "../util/Theme/Dark";
import Light from "../util/Theme/Light";

export const ThemeContext = createContext();

class ThemeContextProvider extends Component {
  state = {
    isLightTheme: true,
    dark: Dark,
    light: Light,
  };

  componentDidMount() {
    /**
     * before render the component, check first if user have selected theme before?
     * if yes, update the state according to localStorage value
     */
    const _isLightTheme = window.localStorage.getItem("isLightTheme");
    if (_isLightTheme === "false") {
      this.setState({
        isLightTheme: false,
      });
    }
    if (_isLightTheme === "true") {
      this.setState({
        isLightTheme: true,
      });
    }
  }

  // toggle current theme
  toggleTheme = () => {
    if (this.state.isLightTheme === false) {
      window.localStorage.setItem("isLightTheme", true);
      this.setState({
        isLightTheme: true,
      });
    } else {
      window.localStorage.setItem("isLightTheme", false);
      this.setState({
        isLightTheme: false,
      });
    }
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
