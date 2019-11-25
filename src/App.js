import React from 'react';
import logo from './logo.svg';
import './App.css';
import Main from './Main/Main';
import FrontPage from './FrontPage/FrontPage';
import NotFound from './NotFound/NotFound';
import { BrowserRouter, Route, Switch, Redirect} from "react-router-dom";
import Navigation from "./Navigation/Navigation";
import 'bootstrap/dist/css/bootstrap.min.css';


function render(title, Cmp) {
  return function ({match}) {
    return <Main title={title}><Cmp match={match} /></Main>
  }
}

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Navigation />
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
      <FrontPage/>

      <Switch>
        <Route path="/" exact><Redirect to="/home" /></Route>
        <Route path="/home" exact render={render('Home', FrontPage)} />
        <Route path="*">
          <Main title="Not Found"><NotFound /></Main>
        </Route>
      </Switch>

    </BrowserRouter>
  );
}

export default App;
