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
import "./UnoGame.css"

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
                {WinCard(gameState.yourPile.length, gameState.sizeOppPile)}
                <SelectColor/>
            </Row>
        </body>
    )
}

/**
 * A simple component to tell the user whether they won or lost
 * @param yourPileSize the size of the users hand
 * @param sizeOppPile the size of the opponents hand
 * @returns 
 */
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

/**
 * This component shows the cards face-up
 * This is used in two places, the users hand and the discardpile
 * If the card comes from the hand we want to send a request to the server when it is clicked
 * Otherwise nothing should happen, that is why we have a boolean for whether the card is in the hadn
 * The request sent to the server is to place the card onto the discardpile.
 * @param card The card to be shown
 * @param hand a boolean value of whether the card is shown from the hand or not
 * @param id the player id of the user
 * @param code the gamecode
 * @returns nothing
 */
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
            <img className="zoom" src={require("./images/"+imageName+".jpg")} alt={"Value: " + card.value + " Colour: " + card.colour} onClick={() => selectCard()} />
        </div>
    )
}

/**
 * In the CardFace component we need to select the correct image for the correct card
 * There is a naming system in the image files and so this function takes a card and 
 * gives the correct imagecode
 * @param card The card to be shown
 * @returns nothing
 */
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

/**
 * Simple comoponent to show the back of cards.
 * This is used for the draw pile and the opponents hand
 * @returns 
 */
function CardBack() {
    return (
    <div className='card-back'>
        <img src={require('./images/back.jpg')} alt={"Back of card"} />
    </div>
        )
} 

/**
 * Component for displaying the opponents hand
 * @param size the size of the opponents hand
 * @returns 
 */
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

/**
 * Component for displaying the users hand
 * @param yourPile the users hand
 * @param player1Name the users name
 * @param gameCode the gamecode
 * @returns 
 */
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

/**
 * Component for the middle row of the whole page.
 * This contains the drawpile the discardpile and the uno button
 * @param topCard The topcard of the discard pile
 * @param playerName the users name
 * @param gameCode the gamecode
 * @returns 
 */
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

/**
 * Simple component for the uno button and its logic
 * @param player1Name the users name
 * @param gameCode the game code
 * @returns 
 */
function UnoButton(player1Name : string, gameCode : string){
    async function onClick(){
        await axios.put("http://localhost:8080/uno/say_uno/"+gameCode+"/"+player1Name)
    }

    return(
        <Button onClick={onClick}>Uno</Button>
    )
}

/**
 * The drawpile's component and its logic
 * @param gameCode the game code
 * @param player1Name the users name
 * @returns 
 */
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