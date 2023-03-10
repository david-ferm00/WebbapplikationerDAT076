import {Card} from './card';

export class Pile extends Array{
    pile: Array<Card> = [];

    constructor(empty : Boolean){
        super();
    }

    shuffleDeck(deck : Array<Card>): Array<Card>{
        let currentIndex = deck.length,  randomIndex;

        while (currentIndex != 0) {
  
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
  
            [deck[currentIndex], deck[randomIndex]] = [
                deck[randomIndex], deck[currentIndex]];
        }
  
        return deck;
    }

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

    remove(card: Card) : Pile {
        if(this.pile.indexOf(card) > -1){
            this.pile.splice(this.pile.indexOf(card), 1);
        }
        return this
    }

    contains(card: Card) : Boolean {
        if(this.pile.includes(card)) {
            return true
        } else {
            return false
        }
    }
}