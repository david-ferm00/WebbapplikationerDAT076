import React, { createElement, useState } from 'react';
import one_red from './images/one_red.jpg'

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

export function DisplayCardFace (card : Card) {
    return <img src={require(card.image)} alt={"Value: " + card.colour + " Colour: " + card.colour} />
}

export function DisplayOpponentDeck (deckSize : number) {
    const [numberOfCards, setCounter] = useState<number>(0);

    <div className='card-back'>
        <img src={require('./images/back.jpg')} alt={"Back of card"} />
    </div>

    return <div className='opponent-hand'>
        {}
    </div>
}
