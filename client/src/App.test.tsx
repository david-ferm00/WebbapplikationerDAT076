import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import exp from 'constants';
import axios from "axios";
import { AxiosStatic } from 'axios';
import WinCard from './unoGame/WinCard';
import {Pile} from "./uno/Pile";
import UnoGame from './unoGame/UnoGame';

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

test("", async () => {
  mockedAxios.get.mockResolvedValue({
    gamestate : [{
      "yourPile":{"pile":[{"colour":0,"value":8},{"colour":1,"value":9},{"colour":2,"value":2},{"colour":2,"value":7},{"colour":0,"value":5}]},
      "yourTurn":false,
      "sizeGamePile":1,
      "sizeDrawPile":81,
      "sizeOppPile":5,
      "topCard":{"colour":1,"value":3},
      "opponentName":"opponent"
    }]
  })
  render(<UnoGame />)
  expect(mockedAxios.get).toHaveBeenCalledWith("http://localhost:8080/uno/:code/:id");
  const taskone = await screen.findByText("opponent");
  expect(taskone).toBeInTheDocument();
})
// ///////////////////////////////////////////////
// test("Should send GET to localhost", async () => {
//   /** This line tells the mocked Axios: when your 'get' method is called,
//    *  return this.
//    */
//   mockedAxios.get.mockResolvedValue({
//     data: [
//       {
//         id: 1,
//         description: "Task 1",
//         done: false
//       },
//       {
//         id: 2,
//         description: "Task 2",
//         done: true
//       }
//     ]
//   });
//   //render(<App />);
//   /** Test that the mocked Axios's get method was called with this argument */
//   expect(mockedAxios.get).toHaveBeenCalledWith("http://localhost:8080/task");
//   /** Use findByText (which will wait for 1 second if it cannot find the element
//    * immediately) instead of getByText to make sure the asynchronous methods in 
//    * App all have time to finish */
//   const taskone = await screen.findByText("Task 1");
//   expect(taskone).toBeInTheDocument();
// })