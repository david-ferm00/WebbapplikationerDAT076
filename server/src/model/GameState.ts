import { Card } from "./card";
import { Pile } from "./Pile";

/**
 * This is a class defining the information that the client needs to be able to show the user the appropriate information
 */
export class GameState {
    yourPile: Pile;
    yourTurn: boolean;
    sizeGamePile: number;
    sizeDrawPile: number;
    sizeOppPile: number;
    topCard: Card;
    opponentName: string;

    constructor(yourPile : Pile, yourTurn : boolean, sizeGamePile : number, sizeDrawPile : number, sizeOppPile : number, topCard : Card, opponentName : string) {
        this.yourPile = yourPile;
        this.yourTurn = yourTurn;
        this.sizeGamePile = sizeGamePile;
        this.sizeDrawPile = sizeDrawPile
        this.sizeOppPile = sizeOppPile;
        this.topCard = topCard;
        this.opponentName = opponentName;
    }
}