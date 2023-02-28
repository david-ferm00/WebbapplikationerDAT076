import axios from 'axios';
import React, { useEffect, useState } from 'react';
import one_red from './images/one_red.jpg'
import { GameState } from './uno/GameState'

interface Card {
    colour : Colour
    value : Value
    image : string
}

export enum Colour{
    red,
    yellow,
    blue,
    green,
    none
}

export enum Value{
    zero,
    one,
    two,
    three,
    four,
    five,
    six,
    seven,
    eight,
    nine,
    plus_two,
    reverse,
    block,
    plus_four,
    colour
}

export function UnoGame(props:{player_id:string, game_id:string}) {

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
            const res = await axios.get<GameState>("http://localhost:3000/game_state", {params: {id: player_id, game_code: game_code}});
            console.log(res.data)
        }, 2000);
        // remove the interval when the component is unmounted
        return () => {
            clearInterval(interval);
        };
    }, []);
    
    return (
    <div>
        <h1>{props.player_id}</h1>
        <img src={one_red}></img> 
    </div>
    )
    

}

export function DisplayCardFace (card : Card) {
    return <img src={require(card.image)} alt={"Value: " + card.colour + " Colour: " + card.colour} />
}

export function DisplayOpponentDeck (deckSize : number) {
    const [numberOfCards, setCounter] = useState<number>(0);
    const cardBack = 
    <div className='card-back'>
        <img src={require('./images/back.jpg')} alt={"Back of card"} />
    </div>

    return <div className='opponent-hand'>
        <p>{numberOfCards}</p>
    </div>
}
