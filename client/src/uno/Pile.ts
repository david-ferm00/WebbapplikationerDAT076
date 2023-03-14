import {Card} from './card';

/**
 * A class which is a collection of cards, and the logic one would want to have.
 */
export class Pile{
    pile: Array<Card> = [];

    pickTopCard(): Card{
        let card: Card = this.pile.pop()!;
        return card;
    }

    addCard(card:Card) {
        this.pile.push(card);
        return this
    } 

    size(): number{
        return this.pile.length;
    }
}