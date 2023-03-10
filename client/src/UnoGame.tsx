import axios from 'axios';
import { useEffect, useState } from 'react';
import { GameState } from './uno/GameState'
import Button from 'react-bootstrap/Button'
import { Pile } from './uno/Pile';
import { Card } from './uno/card';
import { Colour } from './uno/Colour';
import { Value } from './uno/Value';
import { Col, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import SelectColor from './SelectColor';

//make the player able to pick a colour when that happens
//correct calling uno logic. with timings and that. masybe not
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
        opponentName: "Opponent"
    }
    
    const [gameState, updateGameState] = useState<GameState>(defaultGameState);

    useEffect(() => {
        let interval = setInterval(async (player_id : string, game_code : string) => {
            const res = await axios.get<GameState>("http://localhost:8080/uno/game_state/"+gameCode+"/"+playerName);
            updateGameState(res.data);
        }, 200);
        return () => {
            clearInterval(interval);
        };
    }, []);
    
    return (
        <body className="background">
            <Row className="text-center justify-content-center align-items-center">
                <h1>{gameState.opponentName}</h1>
                {DisplayOpponentDeck(gameState.sizeOppPile)}
            </Row>
            <Row className="text-center justify-content-center align-items-center">
                <h1>Draw pile</h1>
                {DisplayDrawPile(gameState.topCard, playerName, gameCode)}
            </Row>
            <Row className="text-center justify-content-center align-items-center">
                <h1>{playerName}</h1>
                {DisplayYourDeck(gameState.yourPile, playerName, gameCode)}
            </Row>
            <Row className="justify-content-center">
                {WinCard(gameState.yourPile.size(), gameState.sizeOppPile)}
                <SelectColor/>
            </Row>
        </body>
    )
}

function WinCard(yourPileSize : number, sizeOppPile : number){
    var message = "";
    if(yourPileSize===0){
        return(
            message = "you win!!!"
        )
    } else if(sizeOppPile===0){
        return(
            message = "you lose!!!"
        )
    }
    return(
        <h1>{message}</h1>
    )
}

function CardFace (card: Card, hand : boolean, id : string, code : string) {
    const imageName = getImageName(card);

    async function selectCard(){
        if(hand){
            var cardToSend;
            if(card.colour===Colour.none){
                cardToSend=new Card(1, card.value);
            }else{
                cardToSend=card;
            }
            await axios.put("http://localhost:8080/uno/select_card/", {card : cardToSend, code : code, id : id});
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
    if(card.value!==11 && card.value!==12){
        switch(card.colour){
            case 0: result = result+"_red"; break;
            case 1: result = result+"_yellow"; break;
            case 2: result = result+"_blue"; break;
            case 3: result = result+"_green"; break;
            default: break;
        }
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

function DisplayYourDeck (yourPile : Pile, player1Name : string, gameCode : string) {

    return( 
    <div className='your-hand'>
        <Row>
            <Col md={3}></Col>
            <Col md={6}>
                <Row className='justify-content-center'>
                    {
                        yourPile.pile.map((card:Card) => (
                            <Col className="md-auto">{CardFace(card, true, player1Name, gameCode)}</Col>
                            ))
                    }
                </Row>
            </Col>
            <Col md={3}></Col>
        </Row>
    </div>)
}

function DisplayDrawPile(topCard : Card, playerName : string, gameCode : string) {
    
    return (
        <div>
            <Row className="justify-content-md-center">
                <Col md="auto">
                    <Row>
                        <Col>{DrawPile(gameCode, playerName)}</Col>
                        <Col>{UnoButton(playerName, gameCode)}</Col>
                        <Col>{CardFace(topCard, false, "", "")}</Col>
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

function DrawPile(gameCode : string, player1Name : string) {
    async function pickUp(){
        await axios.put("http://localhost:8080/uno/pickUpCard/"+gameCode+"/"+player1Name);
    }

    return (
    <div className='card-back'>
        <img src={require('./images/back.jpg')} alt={"Back of card"} onClick={() => pickUp()}/>
    </div>
    )
}

export default UnoGame;