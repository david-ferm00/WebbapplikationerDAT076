import {Card} from '../model/card';
import {Pile} from '../model/Pile';
import { GameState } from '../model/GameState';

export interface IUnoService {
    // define methods to inferface with the router layer

    cardFromDrawPile(player : string) : Promise<void>
    getState(requestedPlayer : string) : GameState
    place(card: Card, player: string) : boolean
    getCode() : string
    getNoOfPlayers() : number
    setPlayerTwo(id : string) : void
    sayUno(player : string) : void
}

export class Game implements IUnoService{
    player1Name : string;
    player2Name : string;

    handPlayer1: Pile;
    handPlayer2 : Pile;
    drawDeck : Pile;
    discardPile : Pile;

    gameCode : string;

    currentPlayer : number;

    gameStatePlayer1 : GameState;
    gameStatePlayer2 : GameState;

    uno : boolean = false;

    constructor(code : string, player1 : string){
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

        this.gameStatePlayer1 = new GameState(this.handPlayer1, this.currentPlayer==1 ? true:false, this.discardPile.size(), this.drawDeck.size(), this.handPlayer2.size(), this.discardPile.seeTopCard());
        this.gameStatePlayer2 = new GameState(this.handPlayer2, this.currentPlayer==2 ? true:false, this.discardPile.size(), this.drawDeck.size(), this.handPlayer1.size(), this.discardPile.seeTopCard());
        
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
            case this.player2Name: this.handPlayer2.addCard(this.drawDeck.pickTopCard());
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

    place(card: Card, player: String) : boolean{
        if(player == this.player1Name && this.whoseTurn()==1){
            if(this.handPlayer1.includes(card)){
                this.handPlayer1.remove(card);
                this.discardPile.addCard(card);
                this.switchPlayer();
                
                /*if(this.handPlayer1.size()==1){
                    this.uno = false;
                    var counter = 2
                    let intervalId = setInterval(() => {
                        counter = counter - 1;
                        if(counter === 0 && !this.uno) this.falseUno(1);
                    }, 1000)
                }*/
                
                if(card.value==10 || card.value==11){
                    for (let index = 0; index < (card.value-9)*2; index++) {
                        this.cardFromDrawPile(this.player2Name)
                    }
                }
                
                return true;
            }
        } else if(player == this.player2Name && this.whoseTurn()==2){
            if(this.handPlayer2.includes(card)){
                this.handPlayer2.remove(card);
                this.discardPile.addCard(card);
                this.switchPlayer();
                
                /*if(this.handPlayer2.size()==1){
                    this.uno = false;
                    var counter = 2
                    let intervalId = setInterval(() => {
                        counter = counter - 1;
                        if(counter === 0 && !this.uno) this.falseUno(2);
                    }, 1000)
                }*/
                
                if(card.value==10 || card.value==11){
                    for (let index = 0; index < (card.value-9)*2; index++) {
                        this.cardFromDrawPile(this.player1Name)
                    }
                }

                return true;
            }
        }
        return false;
    }

    getState(requestedPlayer : string) : GameState{
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
        if(this.player2Name == "") return 1;
        return 2;
    }

    setPlayerTwo(id: string): void {
        this.player2Name = id;
    }

    sayUno(player : string) : void{
        switch(player){
            case this.player1Name: this.handPlayer1.size()>1  ? this.falseUno(1) : this.uno = true;
            case this.player2Name: this.handPlayer2.size()>1  ? this.falseUno(2) : this.uno = true;
        }
    }

    falseUno(player : number){
        if(player==1){
            this.cardFromDrawPile(this.player1Name);
            this.cardFromDrawPile(this.player1Name);
        }
        if(player==2){
            this.cardFromDrawPile(this.player2Name);
            this.cardFromDrawPile(this.player2Name);
        }
    }
}


export function instantiateUnoService(code: string, playerName: string) : IUnoService {
    return new Game(code, playerName); 
}