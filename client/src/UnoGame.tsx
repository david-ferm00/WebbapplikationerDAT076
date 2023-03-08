import axios from 'axios';
import { ReactElement, useEffect, useState } from 'react';
import one_red from './images/1_red.jpg'
import { GameState } from './uno/GameState'
import Button from 'react-bootstrap/Button'
import { Pile } from './uno/Pile';
import { Card } from './uno/card';
import { Colour } from './uno/Colour';
import { Value } from './uno/Value';
import { Col, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { Game } from './uno/Game';

//make the game winnable (what happens when win)
//make the player able to pick a colour when that happens
//correct calling uno logic. with timings and that. masybe not
export function UnoGame() {
    var details = useParams()
    const gameCode = details.gameCode!
    const playerName = details.id!
    
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
    
    const [gameState, updateGameState] = useState<GameState>(defaultGameState);

    useEffect(() => {
        let interval = setInterval(async (player_id : string, game_code : string) => {
            const res = await axios.get<GameState>("http://localhost:8080/uno/game_state/"+playerName);
            updateGameState(res.data);
        }, 2000);
        return () => {
            clearInterval(interval);
        };
    }, []);
    
    return (
        <body className="background">
            <Row className="text-center justify-content-center align-items-center">
                <h1>Opponent</h1>
                {DisplayOpponentDeck(gameState.sizeOppPile)}
            </Row>
            <Row className="text-center justify-content-center align-items-center">
                <h1>Draw pile</h1>
                {DisplayDrawPile(gameState, playerName, gameCode)}
            </Row>
            <Row className="text-center justify-content-center align-items-center">
                <h1>{playerName}</h1>
                {DisplayYourDeck(gameState, playerName, gameCode)}
            </Row>
        </body>
    )
    

}

function CardFace (card: Card, yourTurn : boolean, topCard : Card, hand : boolean, id : string, code : string) {
    const imageName = getImageName(card);

    async function selectCard(){
        if(hand && yourTurn && (topCard.colour==card.colour || topCard.value==card.value)){
            console.log(card);
            await axios.put("http://localhost:8080/uno/select_card/", {card : card, code : code, id : id});
        }
    }

    return(
        <div className="card-front">
            <img src={require("./images/"+imageName+".jpg")} alt={"Value: " + card.value + " Colour: " + card.colour} onClick={() => selectCard()} />
        </div>
    )
}

function getImageName(card: Card) : string{
    var result = ""
    switch(card.value){
        case 10: result = result+"+2"; break;
        case 11: result = result+"+4"; break;
        case 12: result = result+"free_choice"; break;
        default: result = result+card.value.toString(); break;
    }
    switch(card.colour){
        case 0: result = result+"_red"; break;
        case 1: result = result+"_yellow"; break;
        case 2: result = result+"_blue"; break;
        case 3: result = result+"_green"; break;
        default: break;
    }

    return result;
}

function CardBack() {
    return (
    <div className='card-back'>
        <img src={require('./images/back.jpg')} alt={"Back of card"} />
    </div>
        )
} 

function DisplayOpponentDeck (size:number) {

    function getList() : number[]{
        var result = [];
        for (let index = 0; index < size; index++) {
            result.push(1);
        }
        return result;
    }

    return( <div className='opponent-hand'>
        <Row>
            <Col md={3}></Col>
            <Col md={6}>
                <Row className='justify-content-center'>
                    {
                        getList().map(() => (
                        <Col className="md-auto"><CardBack/></Col>
                        ))
                    }
                </Row>
            </Col>
            
            <Col md={3}></Col>
        </Row>
        
        
    </div>)
}

function DisplayYourDeck (gameState : GameState, player1Name : string, gameCode : string) {

    return( 
    <div className='your-hand'>
        <Row>
            <Col md={3}></Col>
            <Col md={6}>
                <Row className='justify-content-center'>
                    {
                        gameState.yourPile.pile.map((card:Card) => (
                            <Col className="md-auto">{CardFace(card, gameState.yourTurn, gameState.topCard, true, player1Name, gameCode)}</Col>
                            ))
                    }
                </Row>
            </Col>
            <Col md={3}></Col>
        </Row>
    </div>)
}

function DisplayDrawPile(gameState:GameState, playerName : string, gameCode : string) {
    
    return (
        <div>
            <Row className="justify-content-md-center">
                <Col md="auto">
                    <Row>
                        <Col onClick={() => console.log(gameState)}>{DrawPile(gameState, gameCode, playerName)}</Col>
                        <Col>{UnoButton(playerName, gameCode)}</Col>
                        <Col>{CardFace(gameState.topCard, false, gameState.topCard, false, "", "")}</Col>
                    </Row>
                </Col>
            </Row>
        </div>
    )
}

function UnoButton(player1Name : string, gameCode : string){
    async function onClick(){
        await axios.put("http://localhost:8080/uno/say_uno/"+gameCode+"/"+player1Name)
    }

    return(
        <Button onClick={onClick}>Uno</Button>
    )
}

function DrawPile(gameState : GameState, gameCode : string, player1Name : string) {
    async function pickUp(){
        if(checkPile(gameState)){
            await axios.put("http://localhost:8080/uno/pickUpCard/"+gameCode+"/"+player1Name);
        }
    }

    return (
    <div className='card-back'>
        <img src={require('./images/back.jpg')} alt={"Back of card"} onClick={() => pickUp()}/>
    </div>
    )
}

function checkPile(gameState: GameState) :  boolean{
    gameState.yourPile.pile.forEach(card => {
        if(card.value == gameState.topCard.value || card.colour == gameState.topCard.colour){
            return false;
        }
    });

    return true;
}

export default UnoGame;