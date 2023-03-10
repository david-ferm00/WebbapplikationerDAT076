import {Card} from './card';
import {Pile} from './Pile';
import { GameState } from './GameState';
import axios from 'axios';

export interface IUnoService {
    // define methods to inferface with the router layer

    cardFromDrawPile(player : string) : Promise<void>
    getState(requestedPlayer: string) : Promise<GameState>
    place(card: Card, player: string) : Promise<boolean>
    getCode() : string
    getNoOfPlayers() : number
    setPlayerTwo(id : string) : void
}

export class Game{
    player1Name : string;

    gameCode : string;
    gameState : GameState;

    constructor(code : string, player1 : string, gameState : GameState){
        this.gameCode = code;
        this.player1Name = player1;
        this.gameState = gameState;
    }

    yourTurn() : boolean {
        return this.gameState.yourTurn;
    }

    async place(card: Card) : Promise<boolean>{
        await axios.post("http://localhost:8080/uno/select_card/", {params: {player_name:this.player1Name , card:card}})
        return false;
    }

    getState() : GameState{
        return this.gameState;
    }

    getCode() : string{
        return this.gameCode;
    }

    updateGameState(gameState : GameState) : void{
        this.gameState = gameState;
    }
}