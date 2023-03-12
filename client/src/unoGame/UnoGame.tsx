import axios from 'axios';
import { useEffect, useState } from 'react';
import { GameState } from '../uno/GameState'
import Button from 'react-bootstrap/Button'
import { Pile } from '../uno/Pile';
import { Card } from '../uno/card';
import { Colour } from '../uno/Colour';
import { Value } from '../uno/Value';
import { Col, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import SelectColorModal from './SelectColor';
import CardFaceHand from './CardFaceHand';
import "./UnoGame.css"
import getImageName from "./getImageName"
import DisplayOpponentDeck from "./DisplayOpponentDeck"
import CardFaceDrawPile from './CardFaceDrawPile';
import UnoButton from './UnoButton';
import DrawPile from './DrawPile';
import DisplayDrawPile from './DisplayDrawPile';
import DisplayYourDeck from './DisplayYourDeck';
import WinCard from './WinCard';

//make the player able to pick a colour when that happens
//correct calling uno logic. with timings and that. masybe not

/**
 * This is the main component of the game page. It brings everything together as well as gives the nessecary information to each component
 * Here, a call to the server requesting the game state is made every 200ms, and then the gamestate is updated.
 * @returns nothing
 */
export function UnoGame() {
    var details = useParams()
    const gameCode = details.gameCode!
    const playerName = details.id!
    
    const fakeCard:Card = {
        colour: Colour.red,
        value: Value.one
    }
    
    const defaultGameState:GameState = {
        yourPile: new Pile(true),
        yourTurn: false,
        sizeGamePile: 0,
        sizeDrawPile: 4,
        sizeOppPile: 0,
        topCard: fakeCard,
        opponentName: "Opponent",
        selectColor: false
    }

    const [gameState, updateGameState] = useState<GameState>(defaultGameState);

    // Download the gameState object from the backend every 200 milisecond 
    useEffect(() => {
        let interval = setInterval(async () => {
            const res = await axios.get<GameState>("http://localhost:8080/uno/game_state/"+gameCode+"/"+playerName);
            updateGameState(res.data);
        }, 200);
        return () => {
            clearInterval(interval);
        };
    }, []);

    var whatColor
    if(gameState.topCard.colour === Colour.none){
        whatColor = (
            <h1></h1>
        )
    }
    
    var yourTurnIndicator = (
        <h1>(wait)</h1>
    )
    if(gameState.yourTurn) {
       yourTurnIndicator = (
            <h1 className='green-text'>(Your turn)</h1>
        )
    }

    var theirTurnIndicator = (
        <h1>(wait)</h1>
    )
    if(!gameState.yourTurn) {
        theirTurnIndicator= (
           <h1 className='green-text'>(Their turn)</h1> 
        )
    }

    // If there is a opponent, render his hand. If there is no opponent, print "No opponent" 
    var opponentSlot: JSX.Element;
    if(gameState.opponentName !== "") {
        opponentSlot = 
        <Row className="text-center justify-content-center align-items-center">
            <h1>{gameState.opponentName}</h1> {theirTurnIndicator}
            <DisplayOpponentDeck size={gameState.sizeOppPile}/>
        </Row>
    } else {
        opponentSlot = 
        <Row className="text-center justify-content-center align-items-center">
            <h1 className='opponent'>No opponent</h1>
        </Row>
    }

    return (
        <body className="background">
            {opponentSlot}
            <Row className="text-center justify-content-center align-items-center">
                <h1>Draw pile</h1>
                <DisplayDrawPile topCard={gameState.topCard} playerName={playerName} gameCode={gameCode}/>
            </Row>
            <Row className="text-center justify-content-center align-items-center">
                <h1>{playerName}</h1>{yourTurnIndicator}
                <DisplayYourDeck yourPile={gameState.yourPile} player_id={playerName} gameCode={gameCode}/>
            </Row>
            <Row className="justify-content-center">
                <WinCard yourPileSize={gameState.yourPile.length} sizeOppPile={gameState.sizeOppPile}/>
            </Row>
        </body>
    )
}

export default UnoGame;