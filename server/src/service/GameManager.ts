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
    place(code : string, card: Card, player: string) : Promise<Boolean>
    getGameList() : Promise<GameListElement[]>
    setPlayerTwo(id : string, code : string) : Promise<Boolean>
    sayUno(player : string, code : string) : Promise<Boolean>
    pickUpCard(player : string, code : string) : Promise<Boolean>
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
    async place(code : string, card: Card, player: String): Promise<Boolean> {
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
        /*if(gameState.sizeDrawPile===0 && gameState.sizeGamePile===0 && gameState.sizeOppPile===0){
            throw new Error("Cannot find game");
        }*/
        return gameState;
    }

    async getGameList() : Promise<GameListElement[]> {
        return this.gameList;
    }

    /**
     * A function for setting the name for the second player
     * This function is called when a request is made for joining a game
     * @param id the name of player2
     */
    async setPlayerTwo(id: string, code : string): Promise<Boolean> {
        var result: Boolean = false;
        function existingGameName(game: Game | GameListElement): Boolean {
            return game.gameCode === code
        }
        
        if(this.currentGames.find(existingGameName) === undefined) {
            throw Error(` There is no game in currentGames with code: ${code}`)
        }
        
        this.currentGames.forEach(game => {
            if(game.getCode() === code) {
                if(game.player1Name === id) {
                    throw Error(`Second player: ${id} can't have the same name as the first player ${game.player1Name}`)
                }
                game.setPlayerTwo(id);
                result = true;
            }
        });

        if(this.gameList.find(existingGameName) === undefined) {
            throw Error(` There is no game in gameList with code: ${code}`)
        }

        this.gameList.forEach(game => {
            if(game.gameCode===code){
                game.noOfPlayers += 1;
            }
        });
        return result;
    }

    /**
     * this function calls the sayUno function in the correct instance of game
     * @param player is the user who pressed the uno button
     * @param code is the code of the game where the uno button was pressed
     */
    async sayUno(player : string, code : string) : Promise<Boolean> {
        var result: Boolean = false;
        function existingGameName(game: Game | GameListElement): Boolean {
            return game.gameCode === code
        }

        if(this.currentGames.find(existingGameName) === undefined) {
            throw Error(` There is no game in currentGames with code: ${code}`)
        }

        this.currentGames.forEach(game => {
            if(game.getCode() === code){
                game.sayUno(player);
                result = true;
            }            
        });
        return result
    }

    /**
     * this function calls the pickUpCard function in the correct instance of game
     * @param player the player requesting a card
     * @param code the code of the game where this occured
     */
    async pickUpCard(player: string, code : string): Promise<Boolean>{
        var result:Boolean = false;
        this.currentGames.forEach(game => {
            if(game.getCode()===code){
                game.pickUpCard(player);
                result = true;
            }
        });
        return result;
    }
}

export function instantiateUnoService() : IUnoService {
    return new GameManager(); 
}