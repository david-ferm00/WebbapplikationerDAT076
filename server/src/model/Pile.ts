import {Card} from './card';

export class Pile{
    pile: Array<Card> = [];

    constructor(empty : Boolean){
        if(!empty){
            this.pile = this.shuffleDeck(this.generateNewPile());
        } else {
            this.pile = [];
        }
    }

    generateNewPile(): Array<Card> {
        let result = [];
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 10; j++) {
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
        //throw console.error("pile empty");
    }
    
    seeTopCard(): Card{
        let card: Card = this.pile.pop()!;
        if(card != undefined){
            let returnCard = new Card(card.colour,card.value);
            this.pile.push(card);
            return returnCard;
        }
        return card;
        //throw console.error("pile empty");
    }

    addCard(card:Card) {
        this.pile.push(card);
    } 

    size(): number{
        return this.pile.length;
    }

    remove(card: Card) : void{
        var newPile : Card[] = []
        this.pile.forEach(element => {
            if(card.colour != element.colour || card.value != card.value){
                newPile.push(element);
            }
        });
        this.pile = newPile;
    }

    includes(card: Card) : boolean{
        var bool = false;
        this.pile.forEach(element => {
            if(card.colour == element.colour && card.value == card.value){
                bool = true;
            }
        });
        return bool;
    }
}