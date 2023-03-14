import { Card } from "../uno/card";
import { Colour } from "../uno/Colour";
import getImageName from "./getImageName"

/**
 * This component represents a single card in the user's hand. It displays the correct image and calls other functions if needed.
 * @param card is the card to be shown
 * @param id is the name of the user. This is used when placing the card
 * @param code is the code of the game
 * @param toggleColorSelect is a function which changes whether the colour selector should be visible or not
 * @param selectCard is the function which places the card on the discard pile
 * @param setSpecialCardValue is a function which changes the colour of the special card to whatever colour the user has chosen
 * @returns 
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