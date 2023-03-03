import {Card} from '../model/card';
import {Pile} from '../model/Pile';
import { GameState } from '../model/GameState';

export interface IUnoService {
    // define methods to inferface with the router layer

    cardFromDrawPile(player : string) : Promise<void>
    getState(requestedPlayer: string) : Promise<GameState>
    place(card: Card, player: string) : Promise<boolean>
    getCode() : string
    getNoOfPlayers() : number
}

export class Game implements IUnoService{
    player1Name : String;
    player2Name : String;

    handPlayer1: Pile;
    handPlayer2 : Pile;
    drawDeck : Pile;
    discardPile : Pile;

    gameCode : string;

    currentPlayer : number;

    gameStatePlayer1 : GameState;
    gameStatePlayer2 : GameState;

    constructor(code : string, player1 : String){
        this.gameCode = code;

        this.handPlayer1 = new Pile(true);
        this.handPlayer2 = new Pile(true);
        this.discardPile = new Pile(true);

        this.drawDeck = new Pile(false);

        this.currentPlayer = this.getRandomInt(2) + 1;

        for (let index = 0; index < 5; index++){
            this.handPlayer1.addCard(this.drawDeck.pickTopCard());
            this.handPlayer2.addCard(this.drawDeck.pickTopCard());           
        }
        this.discardPile.addCard(this.drawDeck.pickTopCard());

        this.gameStatePlayer1 = new GameState(this.handPlayer1, this.currentPlayer==1 ? true:false, 
            this.discardPile.size(), this.drawDeck.size(), this.handPlayer2.size(), this.discardPile.seeTopCard());
        this.gameStatePlayer2 = new GameState(this.handPlayer2, this.currentPlayer==2 ? true:false, 
            this.discardPile.size(), this.drawDeck.size(), this.handPlayer1.size(), this.discardPile.seeTopCard());

        this.player1Name = player1;
        this.player2Name = "";
    }

    setPlayer2Name(name: string){
        this.player2Name = name;
    }

    getRandomInt(max: number) : number {
        return Math.floor(Math.random() * max);
    }

    whoseTurn() : number {
        return this.currentPlayer;
    }

    switchPlayer() : void{
        this.currentPlayer += 1;
        if(this.currentPlayer > 2){
            this.currentPlayer = 1
        }
    }

    topOfDiscard() : Card{
        return this.discardPile.seeTopCard();
    }

    async cardFromDrawPile(player: string) : Promise<void>{
        switch(player){
            case this.player1Name: this.handPlayer1.addCard(this.drawDeck.pickTopCard());
            case this.player2Name: this.handPlayer1.addCard(this.drawDeck.pickTopCard());
            default: break;
        }
    }

    handSize(player: number) : number{
        switch(player){
            case 1: return this.handPlayer1.size();
            case 2: return this.handPlayer2.size();
            default: break;
        }
        return 0;
    }

    async place(card: Card, player: String) : Promise<boolean>{
        if(player == this.player1Name){
            if(this.handPlayer1.remove(card)){
                this.discardPile.addCard(card);
                return true;
            }
        } else if(player == this.player2Name){
            if(this.handPlayer2.remove(card)){
                this.discardPile.addCard(card);
                return true;
            }
        }
        return false;
    }

    async getState(requestedPlayer: String) : Promise<GameState>{
        if(requestedPlayer==this.player1Name){
            this.gameStatePlayer1.sizeDrawPile = this.drawDeck.size();
            this.gameStatePlayer1.sizeGamePile = this.discardPile.size();
            this.gameStatePlayer1.topCard = this.discardPile.seeTopCard();
            this.gameStatePlayer1.yourPile = this.handPlayer1;
            this.gameStatePlayer1.yourTurn = this.currentPlayer==1 ? true:false;
            return this.gameStatePlayer1;
        } else if(requestedPlayer==this.player2Name){
            this.gameStatePlayer2.sizeDrawPile = this.drawDeck.size();
            this.gameStatePlayer2.sizeGamePile = this.discardPile.size();
            this.gameStatePlayer2.topCard = this.discardPile.seeTopCard();
            this.gameStatePlayer2.yourPile = this.handPlayer2;
            this.gameStatePlayer2.yourTurn = this.currentPlayer==2 ? true:false;
            return this.gameStatePlayer2;
        }
        throw Error("not a player");
    }

    getCode() : string{
        return this.gameCode;
    }

    getNoOfPlayers() : number{
        if(this.player1Name == undefined) return 0;
        if(this.player2Name == undefined) return 1;
        return 2;
    }
}

export function instantiateUnoService(code: string, playerName: string) : IUnoService {
    return new Game(code, playerName); 
}