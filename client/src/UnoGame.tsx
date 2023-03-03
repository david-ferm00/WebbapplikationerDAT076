import axios from 'axios';
import { ReactElement, useEffect, useState } from 'react';
import one_red from './images/one_red.jpg'
import { GameState } from './uno/GameState'
import Button from 'react-bootstrap/Button'
import { Pile } from './uno/Pile';
import { Card } from './uno/card';
import { Colour } from './uno/Colour';
import { Value } from './uno/Value';

//export function UnoGame(props:{player_id:string, game_id:string}) {
export function UnoGame() {
    const player_id = "You"
    const game_code = "game123"
    
    const fakeCard:Card = {
        colour: Colour.red,
        value: Value.one,
        image: one_red
    }

    const defaultGameState:GameState = {
        yourPile: new Pile(true),
        yourTurn: false,
        sizeGamePile: 0,
        sizeDrawPile: 4,
        sizeOppPile: 0,
        topCard: fakeCard
    } 

    const [state, updateGameState] = useState(defaultGameState)
    const [opponents, alterOpponents] = useState([""])

    function removeOpponent(opponent : string) {
        alterOpponents(prev => prev.filter((element) => 
        element !== opponent
        ));
    }

    function addOpponent(opponent : string) {
        alterOpponents(prev => prev.concat([opponent]))
    }

    useEffect(() => {
        let interval = setInterval(async (player_id : string, game_code : string) => {
            //const res = await axios.get<GameState>("http://localhost:3000/game_state", {params: {id: player_id, game_code: game_code}});
            const res = await axios.get<GameState>("http://localhost:3000/game_state", {params: {id: player_id}});
            console.log(res.data)
            updateGameState(res.data)
        }, 2000);
        // remove the interval when the component is unmounted
        return () => {
            clearInterval(interval);
        };
    }, []);

    return (
            <>
                <div className="text-center justify-content-center align-items-center">
                    <h1>Opponent</h1>
                    {DisplayOpponentDeck(state.sizeOppPile)}
                </div>
                <div className="text-center justify-content-center align-items-center">
                    <h1>Draw pile</h1>
                    {DisplayDrawPile(state.sizeDrawPile)}
                </div>
                <div className="text-center justify-content-center align-items-center">
                    <h1>{player_id}</h1>
                    {DisplayYourDeck(state.yourPile)}
                </div>
            </>
    )
    

}

function CardFace (card: Card) {
    return <img src={require(card.image)} alt={"Value: " + card.colour + " Colour: " + card.colour} onClick={() => selectCard(card)} />
}

function selectCard(card:Card) {
    console.log("card clicked")
}

function CardBack() {
    return (
        <div className='card-back'>
            <img src={require('./images/back.jpg')} alt={"Back of card"} />
        </div>
        )
} 


function DisplayOpponentDeck (size : number) {
    const [cards, alterNumberOfCards] = useState<number[]>(Array(size));
    
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

function DisplayYourDeck (pile : Pile) {
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
    
    const fakeCard:Card = {
        colour: Colour.red,
        value: Value.one,
        image: one_red
    }

    return <div className='your-hand'>
        <Button onClick={() => addCard(fakeCard)}> Add card</Button>
        <Button onClick={() => removeCard(cards[1])}> Remove card</Button>
        {
            cards.map((card:Card) => (
                <CardFace colour={card.colour} value={card.value} image={card.image} />
            ))
        }
    </div>
}

function DisplayDrawPile(size:number) {
    const cards:number[] = Array(size)
    // if (size > 5) {
    //     return (
    //         {CardBack}
    //     )
    // } else {
    //     const cards:number[] = Array(size)
    //      return (
    //         <div className='draw-pile'>
    //             {
    //                 cards.map(() => (
    //                     <CardBack/>
    //                 ))
    //             }
    //         </div>
    //     )
    // }  
    
    return (
        <div className='draw-pile'>
            {
                cards.map(() => (
                    <CardBack/>
                ))
            }
        </div>
    )
}

export default UnoGame;