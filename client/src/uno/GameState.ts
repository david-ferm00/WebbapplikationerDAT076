import { Card } from "./card";
import { Pile } from "./Pile";

export class GameState {
    yourPile: Pile;
    yourTurn: boolean;
    sizeGamePile: number;
    sizeDrawPile: number;
    sizeOppPile: number;
    topCard: Card;
    opponentName : string;
    selectColor: boolean;

    constructor(yourPile : Pile, yourTurn : boolean, sizeGamePile : number, sizeDrawPile : number, sizeOppPile : number,
         topCard : Card, opponentName : string, selectColor: boolean) {
        this.yourPile = yourPile;
        this.yourTurn = yourTurn;
        this.sizeGamePile = sizeGamePile;
        this.sizeDrawPile = sizeDrawPile
        this.sizeOppPile = sizeOppPile;
        this.topCard = topCard;
        this.opponentName = opponentName;
        this.selectColor = selectColor;
    }
}