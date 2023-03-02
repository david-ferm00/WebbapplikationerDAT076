import axios from 'axios';
import { ReactElement, useEffect, useState } from 'react';
import one_red from './images/one_red.jpg'
import { GameState } from './uno/GameState'
import Button from 'react-bootstrap/Button'
import { Pile } from './uno/Pile';
import { Card } from './uno/card';

//export function UnoGame(props:{player_id:string, game_id:string}) {
export function UnoGame() {
    const player_id = "1"
    const game_code = "game123"

    const [opponents, alterOpponents] = useState([""])

    function RemoveOpponent(opponent : string) {
        alterOpponents(prev => prev.filter((element) => 
        element !== opponent
        ));
    }

    function AddOpponent(opponent : string) {
        alterOpponents(prev => prev.concat([opponent]))
    }

    useEffect(() => {
        let interval = setInterval(async (player_id : string, game_code : string) => {
            //const res = await axios.get<GameState>("http://localhost:3000/game_state", {params: {id: player_id, game_code: game_code}});
            const res = await axios.get<GameState>("http://localhost:3000/game_state", {params: {id: player_id}});
            console.log(res.data)
        }, 2000);
        // remove the interval when the component is unmounted
        return () => {
            clearInterval(interval);
        };
    }, []);

    return (
    <center>
        <h1>{player_id}</h1>
        {DisplayOpponentDeck(0)}
    </center>
    )
    

}

export function CardFace (card: Card) {
    return <img src={require(card.image)} alt={"Value: " + card.colour + " Colour: " + card.colour} onClick={() => selectCard(card)} />
}

function selectCard(card:Card) {
    console.log("card clicked")
}

export function CardBack() {
    return (
        <div className='card-back'>
            <img src={require('./images/back.jpg')} alt={"Back of card"} />
        </div>
        )
} 


export function DisplayOpponentDeck (deckSize : number) {
    const [cards, alterNumberOfCards] = useState<number[]>(Array(deckSize));
    
    function addCard(){
        alterNumberOfCards(prev => prev.concat(1))
    }

    function removeCard(){
        alterNumberOfCards(prev => prev.slice(1))
    }

    return <div className='opponent-hand'>
        <Button onClick={addCard}> Add card</Button>
        <Button onClick={removeCard}> Remove card</Button>
        {
            cards.map(() => (
                <CardBack/>
            ))
        }
        
    </div>
}

export function DisplayYourDeck (pile : Pile) {
    const [cards, alterNumberOfCards] = useState<Pile>(pile);

    function addCard(card:Card): void{
        alterNumberOfCards(prev => prev.addCard(card))
    }

    function removeCard(card:Card): void{
        if (pile.contains(card)) {
            alterNumberOfCards(prev => prev.remove(card))
        }
    }

    // function removeCard(card:Card){
    //     alterNumberOfCards(prev => prev.filter((x) => 
    //     x !== card
    //     ));
    // }
    
    return <div className='your-hand'>
        <Button onClick={() => addCard(cards[2])}> Add card</Button>
        <Button onClick={() => removeCard(cards[1])}> Remove card</Button>
        {
            cards.map((card:Card) => (
                <CardFace colour={card.colour} value={card.value} image={card.image} />
            ))
        }
        
    </div>
}

export default UnoGame;