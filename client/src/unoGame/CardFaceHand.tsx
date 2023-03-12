import { Card } from "../uno/card";
import { Colour } from "../uno/Colour";
import getImageName from "./getImageName"

//TODO Edit this now, sorry I changed it
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
function CardFaceHand (props:{card: Card, id : string, code : string, toggleColorSelect : Function, selectCard : Function, setSpecialCardValue : Function}) {
    const imageName = getImageName(props.card);

    function select() {
        if(props.card.colour===Colour.none) {
            props.toggleColorSelect(true)
            props.setSpecialCardValue(props.card.value)
        } else {
            props.selectCard(props.card)
        }
    }

    return(
        <div className="card-front">
            <img src={require("../images/"+imageName+".jpg")} alt={"Value: " + props.card.value + " Colour: " + props.card.colour} onClick={() => select()} />
        </div>
    )
}

export default CardFaceHand;