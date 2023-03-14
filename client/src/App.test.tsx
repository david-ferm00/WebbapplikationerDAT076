import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import exp from 'constants';
import axios from "axios";
import { AxiosStatic } from 'axios';
import WinCard from './unoGame/WinCard';
import {Pile} from "./uno/Pile";
import UnoGame from './unoGame/UnoGame';
import Mainpage from './Mainpage';
import { BrowserRouter as Router } from "react-router-dom";
import DisplayYourDeck from './unoGame/DisplayYourDeck';
import { Card } from './uno/card';
import CardFaceHand from './unoGame/CardFaceHand';

/** Create the mocked version of Axios */
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<AxiosStatic>

test("Test win component", async () => {
  let calledFunction = false;
  render(<WinCard yourPileSize={0} sizeOppPile={5}></WinCard>);

  expect(screen.getByText("you win!!!")).toBeInTheDocument();
});

test("Test win component when lose", async () => {
  let calledFunction = false;
  render(<WinCard yourPileSize={3} sizeOppPile={0}></WinCard>);

  expect(screen.getByText("you lose!!!")).toBeInTheDocument();
});

test("Check if components are included in uno game", async () => {
  render(<UnoGame/>)
  expect(screen.getByText("Opponent")).toBeInTheDocument();
  expect(screen.getByAltText("Back of card")).toBeInTheDocument();
})

test("Request made when card pressed", async () => {
  render(<DisplayYourDeck yourPile={(new Pile()).addCard(new Card(1,3))} player_id={"playerName"} gameCode={"gameCode"}/>)
  const img = screen.getByAltText("Value: 3 Colour: 1");
  await fireEvent.click(img);
  expect(mockedAxios.put).toBeCalled();
})

test("If mainpage loads", async () => {
  mockedAxios.get.mockResolvedValue({
    gamelist : [[{gameCode : "placement",noOfPlayers :  1}]]
  })
  
  render(<Router><Mainpage /></Router>)
  
  expect(screen.getByText("Uno game")).toBeInTheDocument();
  //expect(mockedAxios.get).toHaveBeenCalledWith("http://localhost:8080/matchmaking/gamelist");
})

// test("", async () => {
//   mockedAxios.get.mockResolvedValue({
//     gamestate : [{
//       "yourPile":{"pile":[{"colour":0,"value":8},{"colour":1,"value":9},{"colour":2,"value":2},{"colour":2,"value":7},{"colour":0,"value":5}]},
//       "yourTurn":false,
//       "sizeGamePile":1,
//       "sizeDrawPile":81,
//       "sizeOppPile":5,
//       "topCard":{"colour":1,"value":3},
//       "opponentName":"opponent"
//     }]
//   })
//   render(<UnoGame />)
//   expect(mockedAxios.get).toHaveBeenCalledWith("http://localhost:8080/uno/game_state//");
// })
