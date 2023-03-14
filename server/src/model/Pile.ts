import {Card} from './card';

/**
 * Class representing a collection of cards and the functionality one would want with that.
 */
export class Pile{
    pile: Array<Card> = [];

    /**
     * If empty is false, that means that the pile must be the draw pile. Therefore it creates a pile with the necessary cards and shuffles.
     * @param empty Whether the pile should start as empty or not
     */
    constructor(empty : Boolean){
        if(!empty){
            this.pile = this.shuffleDeck(this.generateNewPile());
        } else {
            this.pile = [];
        }
    }

    /**
     * This function creates an uno deck with the correct number of each card.
     * @returns A full uno deck
     */
    generateNewPile(): Array<Card> {
        let result = [];
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 11; j++) {
                result.push(new Card(i,j));
                if(j!=0){
                    result.push(new Card(i,j));
                }
            }
        }

        for (let index = 0; index < 2; index++) {
            for (let j = 0; j < 4; j++) {
                result.push(new Card(4, index+11));
            }
            
        }
        return result;
    }

    /**
     * This is a simple function which gives the cards a random order.
     * @param deck is the pile we want to shuffle
     * @returns the shuffled pile
     */
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

    shuffleThisDeck() : Array<Card>{
        return this.shuffleDeck(this.pile);
    }

    pickTopCard(): Card{
        let card: Card = this.pile.pop()!;
        return card;
    }
    
    /**
     * This function is similar to pickTopCard, except it does not actually take the card from the pile.
     * Instead it returns a copy and places the top card back on the pile.
     * @returns The top card
     */
    seeTopCard(): Card{
        let card: Card = this.pile.pop()!;
        if(card != undefined){
            let returnCard = new Card(card.colour,card.value);
            this.pile.push(card);
            return returnCard;
        }
        return card;
    }

    addCard(card:Card) {
        this.pile.push(card);
    } 

    size(): number{
        return this.pile.length;
    }

    /**
     * This function takes a card, and removes it from the pile if it is there.
     * Importantly, it only removes one instance of that card, as it is possible to have multiple of the same card.
     * @param card is the card which we want to remove
     */
    remove(card: Card) : void{
        var oneRemoved = false;
        var newPile : Card[] = []
        this.pile.forEach(element => {
            if(card.colour != element.colour || card.value != element.value || oneRemoved){
                newPile.push(element);
            } else {
                oneRemoved = true;
            }
        });
        this.pile = newPile;
    }

    /**
     * This simple function returns whether or not a specific card can be found in the pile.
     * @param card is the card which we want to find
     * @returns whether the card is in the pile or not
     */
    includes(card: Card) : boolean{
        var bool = false;
        this.pile.forEach(element => {
            if(card.colour == element.colour && card.value == element.value){
                bool = true;
            }
        });
        return bool;
    }
}