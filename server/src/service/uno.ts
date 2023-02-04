import { Card } from "../model/card";
import { Colour } from "../model/Colour";
import { Value } from "../model/Value";


interface IUnoService {
    // define methods to inferface with the router layer

    getState() : Promise<GameState>
}

class unoService implements IUnoService {

    //Dummy info
    card1 : Card = new Card(Colour.green, Value.five)
    card2 : Card = new Card(Colour.blue, Value.two)
    myHand : Array<Card> = new Array(this.card1);    

    game_state : GameState = new GameState(this.myHand, true, 8, 20, 5, this.card2)

    async getState() : Promise<GameState> {
        return this.game_state;
    }
}

export class GameState {
    yourPile: Array<Card>;
    yourTurn: Boolean;
    sizeGamePile: number;
    sizeDrawPile: number;
    sizeOppPile: number;
    topCard: Card;

    constructor(yourPile : Array<Card>, yourTurn : Boolean, sizeGamePile : number, sizeDrawPile : number, sizeOppPile : number, topCard : Card) {
        this.yourPile = yourPile;
        this.yourTurn = yourTurn;
        this.sizeGamePile = sizeGamePile;
        this.sizeDrawPile = sizeDrawPile
        this.sizeOppPile = sizeOppPile;
        this.topCard = topCard;
    }
}

export function instantiateUnoService() : IUnoService {
    return new unoService(); 
}