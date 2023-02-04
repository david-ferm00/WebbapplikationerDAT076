import {Card} from './card';

export class Pile{
    pile: Array<Card> = [];

    constructor(empty : Boolean){
        if(!empty){
            let pile = this.shuffleDeck(this.generateNewPile());
        } else {
            let pile = [];
        }
    }

    generateNewPile(): Array<Card> {
        let result = [];
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 13; j++) {
                result.push(new Card(i,j));
                if(j!=0){
                    result.push(new Card(i,j));
                }
            }
        }

        for (let index = 0; index < 2; index++) {
            for (let j = 0; j < 4; j++) {
                result.push(new Card(4, index+13));
            }
            
        }
        return [];
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
        if(card != undefined){
            return card;
        }
        throw console.error("pile empty");
        
    }
    
    seeTopCard(): Card{
        let card: Card = this.pile.pop()!;
        if(card != undefined){
            let returnCard = new Card(card.colour,card.value);
            this.pile.push(card);
            return returnCard;
        }
        throw console.error("pile empty");
    }

    addCard(card:Card) {
        this.pile.push(card);
    } 
}