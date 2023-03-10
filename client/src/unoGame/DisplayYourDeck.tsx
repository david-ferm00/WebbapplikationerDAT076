import axios from "axios";
import { useState } from "react";
import { Col, Row } from "react-bootstrap";
import CardFaceHand from "./CardFaceHand";
import { Card } from "../uno/card";
import { Colour } from "../uno/Colour";
import { Pile } from "../uno/Pile";
import { Value } from "../uno/Value";
import { SelectColor } from "./SelectColor"

/**
 * Component for displaying the user's hand
 * There are some functions which are defined here that are then sent to other components so that they can make changes to themselves.
 * The reason for this is that we want to keep the colour choosing component separate. However, in order to have the colour changing
 * feature, we need to be able to make changes to the card.
 * @param yourPile the users hand
 * @param player1Name the users name
 * @param gameCode the gamecode
 * @returns 
 */
function DisplayYourDeck (props:{yourPile : Pile, player_id : string, gameCode : string}) {

    const [selectingColour, toggleColorSelect] = useState<boolean>(false);
    const [specialCardValue, setSpecialCardValue] = useState<Value>(Value.none);

    function selectSpecialCard(colour:Colour) {
        putCard(new Card(colour, specialCardValue))
    }

    async function putCard(cardToSend:Card){
        await axios.put("http://localhost:8080/uno/select_card/"+props.gameCode+"/"+props.player_id, {card : cardToSend});
    }

    var returnValue
    if(!selectingColour) {
        returnValue = <div className='your-hand'>
            <Row>
                <Col md={3}></Col>
                <Col md={6}>
                    <Row className='justify-content-center'>
                        {
                            props.yourPile.pile.map((card:Card) => (
                                <Col className="md-auto zoom">
                                    <CardFaceHand card={card} id={props.player_id} code={props.gameCode} 
                                    toggleColorSelect={toggleColorSelect} selectCard={putCard} setSpecialCardValue={setSpecialCardValue}/>
                                </Col>
                            ))
                        }
                    </Row>
                </Col>
                <Col md={3}></Col>
            </Row>
        </div>
    } else {
        returnValue = <SelectColor toggleSelectColour = {toggleColorSelect} selectSpecialCard = {selectSpecialCard} />
    }

    return( 
        returnValue
    )
}

export default DisplayYourDeck