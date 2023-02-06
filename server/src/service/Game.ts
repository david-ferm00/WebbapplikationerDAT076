import {Card} from '../model/card';
import {Pile} from '../model/Pile';
import { GameState } from './GameState';

interface IUnoService {
    // define methods to inferface with the router layer

    getState(requestedPlayer: number) : Promise<GameState>
}

export class Game implements IUnoService{
    handPlayer1: Pile;
    handPlayer2 : Pile;
    drawDeck : Pile;
    discardPile : Pile;

    gameCode : String;

    currentPlayer : number;

    gameStatePlayer1 : GameState;
    gameStatePlayer2 : GameState;

    constructor(code : String){
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

    cardFromDrawPile(player: number) : void{
        switch(player){
            case 1: this.handPlayer1.addCard(this.drawDeck.pickTopCard());
            case 2: this.handPlayer1.addCard(this.drawDeck.pickTopCard());
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

    place(card: Card, player: number) : void{
        if(player == 1){
            if(this.handPlayer1.remove(card)){
                this.discardPile.addCard(card);
            }
        } else if(player == 2){
            if(this.handPlayer2.remove(card)){
                this.discardPile.addCard(card);
            }
        }
    }

    async getState(requestedPlayer: number) : Promise<GameState>{
        if(requestedPlayer==1){
            this.gameStatePlayer1.sizeDrawPile = this.drawDeck.size();
            this.gameStatePlayer1.sizeGamePile = this.discardPile.size();
            this.gameStatePlayer1.topCard = this.discardPile.seeTopCard();
            this.gameStatePlayer1.yourPile = this.handPlayer1;
            this.gameStatePlayer1.yourTurn = this.currentPlayer==1 ? true:false;
            return this.gameStatePlayer1;
        } else if(requestedPlayer==2){
            this.gameStatePlayer2.sizeDrawPile = this.drawDeck.size();
            this.gameStatePlayer2.sizeGamePile = this.discardPile.size();
            this.gameStatePlayer2.topCard = this.discardPile.seeTopCard();
            this.gameStatePlayer2.yourPile = this.handPlayer2;
            this.gameStatePlayer2.yourTurn = this.currentPlayer==2 ? true:false;
            return this.gameStatePlayer2;
        }
        throw Error("not a player");
    }
}

export function instantiateUnoService() : IUnoService {
    return new Game("tbd"); 
}