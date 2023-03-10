import React from 'react';
import logo from './logo.svg';
import './App.css';
import Button from 'react-bootstrap/Button';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
} from "react-router-dom";
import UnoGame from './UnoGame';
import Mainpage from './Mainpage';

/**
 * Here we define the different pages in the application, and how to reach them.
 * @returns nothing
 */
function App() {

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Mainpage />}/>
        <Route path='/UnoGame/:gameCode/:id' element={<UnoGame />}/>
      </Routes>
    </Router>
  );
}

export default App

