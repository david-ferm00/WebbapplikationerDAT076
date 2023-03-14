import {Card} from '../model/card';
import {Pile} from '../model/Pile';
import { GameState } from '../model/GameState';
import { Colour } from '../model/Colour';

/**
 * This class represents one instance of a game
 * The instance variables are fairly self-explanatory, except maybe uno
 * uno is a variable which tells us whether the uno button has been pressed or not
 */
export class Game{
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
        while(this.discardPile.seeTopCard().colour===Colour.none){
            this.discardPile.addCard(this.drawDeck.pickTopCard());
        }

        this.player2Name = "";
        this.gameStatePlayer1 = new GameState(this.handPlayer1, this.currentPlayer==1 ? true:false, this.discardPile.size(), this.drawDeck.size(), this.handPlayer2.size(), this.discardPile.seeTopCard(), this.player2Name);
        this.gameStatePlayer2 = new GameState(this.handPlayer2, this.currentPlayer==2 ? true:false, this.discardPile.size(), this.drawDeck.size(), this.handPlayer1.size(), this.discardPile.seeTopCard(), player1);
        
        this.player1Name = player1;
    }

    /**
     * a function to find a random integer
     * @param max the max of the range of random integers
     * @returns the random integer
     */
    private getRandomInt(max: number) : number {
        return Math.floor(Math.random() * max);
    }

    /**
     * Changes whose turn it is
     */
    private switchPlayer() : void{
        this.currentPlayer += 1;
        if(this.currentPlayer > 2){
            this.currentPlayer = 1
        }
    }

    /**
     * This function gives the top card of the discard pile
     * @returns the top card of the discard pile
     */
    private topOfDiscard() : Card{
        return this.discardPile.seeTopCard();
    }

    /**
     * This function takes a card from the draw pile and gives it to one of the players hands
     * @param player the player who's getting a card
     */
    private cardFromDrawPile(player: string) : void{
        switch(player){
            case this.player1Name: this.handPlayer1.addCard(this.drawDeck.pickTopCard()); break;
            case this.player2Name: this.handPlayer2.addCard(this.drawDeck.pickTopCard()); break;
            default: throw Error("not a player"); break;
        }
        if(this.drawDeck.size()===0){
            var topCard : Card = this.discardPile.pickTopCard();
            this.drawDeck.pile = this.discardPile.shuffleThisDeck();
            this.discardPile = new Pile(true);
            this.discardPile.addCard(topCard);
        }
    }

    /**
     * This function takes a selected card from a players hand and places it on the discard pile
     * It only places the card if it is allowed according to the rules of UNO
     * @param card the selected card
     * @param player the player who is trying to place the card
     * @returns Boolean that indicates if the placement was successful
     */
    place(card: Card, player: String): Boolean {
        var result:Boolean = false;
        var actualCard: Card = card;
        if(card.value==11 || card.value==12){
            actualCard = new Card(4, card.value);
        }
        if(actualCard.colour===this.topOfDiscard().colour || actualCard.value===this.topOfDiscard().value || actualCard.colour==4){
            if(player == this.player1Name && this.currentPlayer==1){
                if(this.handPlayer1.includes(actualCard)){
                    this.handPlayer1.remove(actualCard);
                    this.discardPile.addCard(card);
                    this.switchPlayer();
                    
                    if(card.value==10 || card.value==11){
                        for (let index = 0; index < (card.value-9)*2; index++) {
                            this.cardFromDrawPile(this.player2Name)
                        }
                    }

                    if(this.handPlayer1.size()===1) this.startUnoTimer(1);
                    
                    return true;
                }
            } else if(player == this.player2Name && this.currentPlayer==2){
                if(this.handPlayer2.includes(actualCard)){
                    this.handPlayer2.remove(actualCard);
                    this.discardPile.addCard(card);
                    this.switchPlayer();
                    
                    if(card.value==10 || card.value==11){
                        for (let index = 0; index < (card.value-9)*2; index++) {
                            this.cardFromDrawPile(this.player1Name)
                        }
                    }

                    if(this.handPlayer1.size()===1) this.startUnoTimer(2);
                    
                    return true;
                }
            }
        }
        return result;
    }

    /**
     * If a player has reached only one card, this function is called, which starts a timer for 2 seconds
     * When the timer runs out, if the player has not pressed the button, they recieve two cards.
     * @param player which player has only one card
     */
    private startUnoTimer(player : number){
        var counter = 2;
        this.uno = false;
        let intervalId = setInterval(() => {
            counter = counter - 1;
            if(counter === 0){
                if(this.uno===false){
                    this.falseUno(player);
                } else {
                    this.uno = false;
                }
                clearInterval(intervalId)
            } 
        }, 1000)
    }

    /**
     * This function updates and gives the players the information they need to display the game
     * @param requestedPlayer the player who is requesting the state
     * @returns the state of the game
     */
    getState(requestedPlayer : string) : GameState{
        if(requestedPlayer==this.player1Name){
            this.gameStatePlayer1.sizeDrawPile = this.drawDeck.size();
            this.gameStatePlayer1.sizeGamePile = this.discardPile.size();
            this.gameStatePlayer1.sizeOppPile = this.handPlayer2.size();
            this.gameStatePlayer1.topCard = this.discardPile.seeTopCard();
            this.gameStatePlayer1.yourPile = this.handPlayer1;
            this.gameStatePlayer1.yourTurn = this.currentPlayer==1 ? true:false;
            this.gameStatePlayer1.opponentName = this.player2Name
            return this.gameStatePlayer1;
        } else if(requestedPlayer==this.player2Name){
            this.gameStatePlayer2.sizeDrawPile = this.drawDeck.size();
            this.gameStatePlayer2.sizeGamePile = this.discardPile.size();
            this.gameStatePlayer2.sizeOppPile = this.handPlayer1.size();
            this.gameStatePlayer2.topCard = this.discardPile.seeTopCard();
            this.gameStatePlayer2.yourPile = this.handPlayer2;
            this.gameStatePlayer2.yourTurn = this.currentPlayer==2 ? true:false;
            this.gameStatePlayer2.opponentName = this.player1Name
            return this.gameStatePlayer2;
        }
        throw Error(requestedPlayer + " is not a player in game: " + this.gameCode);
    }
    
    getCode() : string{
        return this.gameCode;
    }

    getNoOfPlayers() : number{
        if(this.player1Name == undefined) return 0;
        if(this.player2Name == "") return 1;
        return 2;
    }

    /**
     * A function for setting the name for the second player
     * This function is called when a request is made for joining a game
     * @param id the name of player2
     */
    setPlayerTwo(id: string): void {
        this.player2Name = id;
    }

    /**
     * This function is called when a player presses the uno button
     * if the player has more than one card in their hand they pick up two cards
     * @param player the player who press uno
     */
    sayUno(player : string) : void{
        switch(player){
            case this.player1Name: this.handPlayer1.size()>1  ? this.falseUno(1) : this.uno = true; break;
            case this.player2Name: this.handPlayer2.size()>1  ? this.falseUno(2) : this.uno = true; break;
        }
    }

    /**
     * If the player presses the uno button when they have more than one card this function is called
     * This function gives the player two cards
     * @param player the player who is getting cards
     */
    private falseUno(player : number){
        if(player==1){
            this.cardFromDrawPile(this.player1Name);
            this.cardFromDrawPile(this.player1Name);
        }
        if(player==2){
            this.cardFromDrawPile(this.player2Name);
            this.cardFromDrawPile(this.player2Name);
        }
    }

    /**
     * This function is called when a player requests a card from the draw  pile
     * the player should only get a card if it is their turn and if they cannot play anything
     * @param player the player who requested a card
     */
    pickUpCard(player: string): void{
        if(player == this.player1Name && this.currentPlayer==1){
            if(this.checkPile(this.handPlayer1)){
                this.cardFromDrawPile(player);
            }
        } else if(player == this.player2Name && this.currentPlayer==2){
            if(this.checkPile(this.handPlayer2)){
                this.cardFromDrawPile(player);
            }
        }
    }

    /**
     * This function checks a Pile and returns whether there is a playable card or not
     * @param pile the pile being checked
     * @returns whether the pile is such that the player is allowed to pick up a card
     */
    private checkPile(pile: Pile) :  boolean{
        var bool = true;
        pile.pile.forEach(card => {
            if(card.value === this.topOfDiscard().value || card.colour === this.topOfDiscard().colour || card.colour===4){
                bool = false;
            }
        });
        return bool;
    }
}