import {Card} from '../model/card';
import { GameState } from '../model/GameState';
import { Game } from './Game';

export interface IUnoService {
    // define methods to inferface with the router layer

    createGame(code : string, name : string) : void

    getState(requestedPlayer : string, code : string) : GameState
    place(code : string, card: Card, player: string) : void
    getCode() : string
    getNoOfPlayers() : number
    setPlayerTwo(id : string, code : string) : void
    sayUno(player : string, code : string) : void
    pickUpCard(player : string, code : string) : void
}

export class GameManager implements IUnoService{
    currentGames : Game[] = [];

    createGame(code: string, name: string): void {
        this.currentGames.push(new Game(code, name));
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
        var gameState : GameState;
        this.currentGames.forEach(game => {
            if(game.getCode()===code){
                gameState = game.getState(requestedPlayer);
            }
        });
        return gameState;
    }
    
    getCode() : string{

    }

    getNoOfPlayers() : number{
    
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