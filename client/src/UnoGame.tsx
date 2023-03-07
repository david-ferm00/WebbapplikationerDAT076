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


interface details{
    gameCode : string,
    playerID : string
}
//export function UnoGame(props:{player_id:string, game_id:string}) {
export function UnoGame() {
    var details = useParams()
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
    
    const game = new Game(details.gameCode!, details.id!, defaultGameState)

    useEffect(() => {
        let interval = setInterval(async (player_id : string, game_code : string) => {
            //const res = await axios.get<GameState>("http://localhost:3000/game_state", {params: {id: player_id, game_code: game_code}});
            const res = await axios.get<GameState>("http://localhost:8080/uno/game_state/"+game.player1Name);
            game.updateGameState(res.data);
        }, 2000);
        // remove the interval when the component is unmounted
        return () => {
            clearInterval(interval);
        };
    }, []);
    
    return (
        <body className="background">
            <Row className="text-center justify-content-center align-items-center">
                <h1>Opponent</h1>
                {DisplayOpponentDeck(game.gameState.sizeOppPile)}
            </Row>
            <Row className="text-center justify-content-center align-items-center">
                <h1>Draw pile</h1>
                {DisplayDrawPile(game)}
            </Row>
            <Row className="text-center justify-content-center align-items-center">
                <h1>{player_id}</h1>
                {DisplayYourDeck(game)}
            </Row>
        </body>
    )
    

}

function CardFace (card: Card, yourTurn : boolean, topCard : Card, hand : boolean, id : string, code : string) {
    async function selectCard(){
        console.log(code)
        if(hand && yourTurn && (topCard.colour==card.colour || topCard.value==card.value)){
            await axios.put("http://localhost:8080/uno/select_card/"+code+"/"+id, {card : card});
        }
    }

    return(
        <div className="card-front">
            <img src={require("./images/"+"1_red"+".jpg")} alt={"Value: " + card.value + " Colour: " + card.colour} onClick={() => selectCard()} />
        </div>
    )
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

    return( <div className='opponent-hand'>
        <Button onClick={addCard}> Add card</Button>
        <Button onClick={removeCard}> Remove card</Button>
        <Row>
            <Col md={3}></Col>
            <Col md={6}>
                <Row>
                    {
                        cards.map(() => (
                        <Col className="md-auto"><CardBack/></Col>
                        ))
                    }
                </Row>
            </Col>
            
            <Col md={3}></Col>
        </Row>
        
        
    </div>)
}

function DisplayYourDeck (game : Game) {
    //make this view update when drawdeck is clicked
    const fakeCard:Card = {
        colour: Colour.red,
        value: Value.one,
        image: "one_red"
    }
    const [cards, alterNumberOfCards] = useState<Pile>(game.gameState.yourPile);
    const [id, changeID] = useState<string>("");
    const [code, changeCode] = useState<string>("");
    const [yourTurn, changeTurn] = useState<boolean>(false);
    const [topCard, changeTopCard] = useState<Card>(fakeCard);
    

    useEffect(() => {
        let interval = setInterval(async (player_id : string, game_code : string) => {
            alterNumberOfCards(game.gameState.yourPile)
            changeTurn(game.gameState.yourTurn)
            changeTopCard(game.gameState.topCard)
            changeID(game.player1Name)
            changeCode(game.gameCode)
        }, 2000);
        return () => {
            clearInterval(interval);
        };
    }, []);

    return( 
    <div className='your-hand'>
        <Row>
            <Col md={3}></Col>
            <Col md={6}>
                <Row>
                    {
                        cards.pile.map((card:Card) => (
                            <Col className="md-auto">{CardFace(card, yourTurn, topCard, true, id, code)}</Col>
                            ))
                    }
                </Row>
            </Col>
            <Col md={3}></Col>
        </Row>
    </div>)
}

function DisplayDrawPile(game:Game) {
    //const cards:number[] = Array(size)
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

    const fakeCard:Card = {
        colour: Colour.red,
        value: Value.one,
        image: "one_red"
    }
    
    return (
        <div>
            <Row className="justify-content-md-center">
                <Col md="auto">
                    <Row>
                        <Col onClick={() => console.log(game.gameState)}>{DrawPile(game)}</Col>
                        <Col>{UnoButton(game)}</Col>
                        <Col>{CardFace(game.gameState.topCard, false, game.gameState.topCard, false, "", "")}</Col>
                    </Row>
                </Col>
            </Row>
        </div>
    )
}

function UnoButton(game : Game){
    async function onClick(){
        await axios.put("http://localhost:8080/uno/say_uno/"+game.gameCode+"/"+game.player1Name)
    }

    return(
        <Button onClick={onClick}>Uno</Button>
    )
}

function DrawPile(game : Game) {
    async function pickUp(game : Game){
        if(checkPile(game)){
            await axios.put("http://localhost:8080/uno/pickUpCard/"+game.gameCode+"/"+game.player1Name);
        }
    }

    return (
    <div className='card-back'>
        <img src={require('./images/back.jpg')} alt={"Back of card"} onClick={() => pickUp(game)}/>
    </div>
    )
}

function checkPile(game: Game) :  boolean{
    game.gameState.yourPile.pile.forEach(card => {
        if(card.value == game.gameState.topCard.value || card.colour == game.gameState.topCard.colour){
            return false;
        }
    });

    return true;
}

export default UnoGame;