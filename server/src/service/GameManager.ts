import {Card} from '../model/card';
import { GameState } from '../model/GameState';
import { Pile } from '../model/Pile';
import { Game } from './Game';
import { GameListElement } from './GameListElement';

export interface IUnoService {
    // define methods to inferface with the router layer

    createGame(code : string, name : string) : void

    getState(requestedPlayer : string, code : string) : GameState
    place(code : string, card: Card, player: string) : void
    getGameList() : GameListElement[]
    setPlayerTwo(id : string, code : string) : void
    sayUno(player : string, code : string) : void
    pickUpCard(player : string, code : string) : void
}

export class GameManager implements IUnoService{
    currentGames : Game[] = [];
    gameList : GameListElement[] = [];

    createGame(code: string, name: string): void {
        this.currentGames.push(new Game(code, name));
        this.gameList.push(new GameListElement(code, 1));
    }

    /**
     * This function takes a selected card from a players hand and places it on the discard pile
     * It only places the card if it is allowed according to the rules of UNO
     * @param card the selected card
     * @param player the player who is trying to place the card
     */
    place(code : string, card: Card, player: String){
        this.currentGames.forEach(game => {
            if(game.getCode()===code){
                game.place(card, player);
            }
        });
    }

    /**
     * This function updates and gives the players the information they need to display the game
     * @param requestedPlayer the player who is requesting the state
     * @returns the state of the game
     */
    getState(requestedPlayer : string, code : string) : GameState{
        var gameState : GameState = new GameState(new Pile(true), false, 0, 0, 0, new Card(0,0), "");
        this.currentGames.forEach(game => {
            if(game.getCode()===code){
                gameState = game.getState(requestedPlayer);
            }
        });
        /*if(gameState.sizeDrawPile===0 && gameState.sizeGamePile===0 && gameState.sizeOppPile===0){
            throw new Error("Cannot find game");
        }*/
        return gameState;
    }

    getGameList() : GameListElement[]{
        return this.gameList;
    }

    /**
     * A function for setting the name for the second player
     * This function is called when a request is made for joining a game
     * @param id the name of player2
     */
    setPlayerTwo(id: string, code : string): void {
        this.currentGames.forEach(game => {
            if(game.getCode()===code){
                game.setPlayerTwo(id);
            }
        });
        this.gameList.forEach(game => {
            if(game.gameCode===code){
                game.noOfPlayers += 1;
            }
        });
    }

    /**
     * This function is called when a player presses the uno button
     * if the player has more than one card in their hand they pick up two cards
     * @param player the player who press uno
     */
    sayUno(player : string, code : string) : void{
        this.currentGames.forEach(game => {
            if(game.getCode()===code){
                game.sayUno(player);
            }            
        });
    }

    /**
     * This function is called when a player requests a card from the draw  pile
     * the player should only get a card if it is their turn and if they cannot play anything
     * @param player the player who requested a card
     */
    pickUpCard(player: string, code : string): void{
        this.currentGames.forEach(game => {
            if(game.getCode()===code){
                game.pickUpCard(player);
            }
        });
    }
}

export function instantiateUnoService() : IUnoService {
    return new GameManager(); 
}