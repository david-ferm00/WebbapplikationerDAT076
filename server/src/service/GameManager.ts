import {Card} from '../model/card';
import { GameState } from '../model/GameState';
import { Pile } from '../model/Pile';
import { Game } from './Game';
import { GameListElement } from './GameListElement';

export interface IUnoService {
    // define methods to inferface with the router layer

    // TODO Change these to return promises!! No voids, they should return something
    createGame(code : string, name : string) : Promise<Boolean>
    getState(requestedPlayer : string, code : string) : GameState
    place(code : string, card: Card, player: string) : Boolean
    getGameList() : GameListElement[]
    setPlayerTwo(id : string, code : string) : void
    sayUno(player : string, code : string) : void
    pickUpCard(player : string, code : string) : void
}

/**
 * This class acts as a middle man between the router and the game class.
 * It makes sure that the request goes to the correct instance of game, allowing the program to run multiple games at the same time
 */
export class GameManager implements IUnoService{
    currentGames : Game[] = [];
    gameList : GameListElement[] = [];

    /**
     * creates an instance of Game and adds it to the correct lists.
     * @param code is the code of the game to be created
     * @param name is the id of the player who created the game
     * @returns a boolean of whether or not the process worked
     */
    async createGame(code: string, name: string): Promise<Boolean> {
        var result:Boolean = true
        function sameName(game : Game | GameListElement): Boolean {
            return (game.getCode() === code)
        }
        if(this.currentGames.find(sameName) === undefined) {
            this.currentGames.push(new Game(code, name));
        } else {
            result = false
        }

        if(this.gameList.find(sameName) === undefined) {
            this.gameList.push(new GameListElement(code, 1));
        } else {
            result = false
        }
        return result
    }

    /**
     * This function calls the place function in the correct instance of game
     * @param code is the game code of the game where this request took place
     * @param card is the card to be placed
     * @param player is the player who wants to place the card
     * @returns a boolean on whether the card was placed or not
     */
    place(code : string, card: Card, player: String) : Boolean{
        var result:Boolean = false;
        this.currentGames.forEach(game => {
            if(game.getCode()===code){
                result = game.place(card, player);
            }
        });
        return result;
    }

    /**
     * This function calls the getState function in the correct instance of game
     * @param requestedPlayer the player who is requesting the state
     * @param code is the code of the game where this request was made
     * @returns the state of the game
     */
    getState(requestedPlayer : string, code : string) : GameState {
        var gameState : GameState = new GameState(new Pile(true), false, 0, 0, 0, new Card(0,0), "");
        this.currentGames.forEach(game => {
            if(game.getCode()===code){
                gameState = game.getState(requestedPlayer);
            }
        });
        return gameState;
    }

    getGameList() : GameListElement[]{
        return this.gameList;
    }

    /**
     * This function sets the name of the second player in the game that they want to join
     * It also updates the gameListElement of that game.
     * @param id is the id of the second player
     * @param code is the code of the game which the user wants to join
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
     * this function calls the sayUno function in the correct instance of game
     * @param player is the user who pressed the uno button
     * @param code is the code of the game where the uno button was pressed
     */
    sayUno(player : string, code : string) : void{
        this.currentGames.forEach(game => {
            if(game.getCode()===code){
                game.sayUno(player);
            }            
        });
    }

    /**
     * this function calls the pickUpCard function in the correct instance of game
     * @param player the player requesting a card
     * @param code the code of the game where this occured
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