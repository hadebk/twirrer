import React from 'react';
import { Router , Route, Switch } from 'react-router-dom';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import Page404 from './pages/Page404/Page404';
import History from './History';
import ThemeContextProvider from './context/ThemeContext';

function App() {
  return (
    <Router history={History} >
    <div className="App">
      <ThemeContextProvider>
          <Switch> {/* let one Route invoked at a time */}
            <Route exact path="/" component={Home}/>
            <Route path="/login" component={Login}/>
            <Route path="/signup" component={Signup}/>
            <Route component={Page404} />
          </Switch>
      </ThemeContextProvider>
    </div>
  </Router>
  );
}

export default App;
