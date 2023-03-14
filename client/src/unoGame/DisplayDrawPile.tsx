import { Col, Row } from "react-bootstrap";
import CardFaceDiscardPile from "./CardFaceDiscardPile";
import DrawPile from "./DrawPile";
import { Card } from "../uno/card";
import UnoButton from "./UnoButton";

/**
 * Component for the middle row of the whole page.
 * This contains the drawpile the discardpile and the uno button
 * @param topCard The topcard of the discard pile
 * @param playerName the users name
 * @param gameCode the gamecode
 * @returns 
 */
function DisplayDrawPile(props:{topCard : Card, playerName : string, gameCode : string}) {
    
    return (
        <div>
            <Row className="justify-content-md-center">
                <Col md="auto">
                    <Row>
                        <Col className='zoom'><DrawPile gameCode={props.gameCode} playerName={props.playerName}/></Col>
                        <Col><UnoButton playerName={props.playerName} gameCode={props.gameCode}/></Col>
                        <Col><CardFaceDiscardPile card={props.topCard}/></Col>
                    </Row>
                </Col>
            </Row>
        </div>
    )
}

export default DisplayDrawPile