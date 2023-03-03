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
import { useParams } from "react-router-dom"

function App() {

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Mainpage />}/>
        <Route path='/UnoGame' handle={Start}/>
      </Routes>
    </Router>

    
  );

  
  function Start() {
    var {player_id, gameCode} = useParams()
    if(typeof(player_id) === undefined) {
      throw new Error("player_id is undefined")
    }
    
    if(typeof(gameCode) === undefined) {
      throw new Error("gameCode is undefined")
    }
    UnoGame({player_id:"player_id", game_id:"gameCode"})
  }
}

export default App

