import getImageName from "./getImageName";
import { Card } from "../uno/card";
 
/**
 * This simple component is the discard pile. It shows what card is at the top of the pile.
 * @param props contains the card which at the top of the discard pile. 
 * @returns 
 */
function CardFaceDiscardPile (props:{card: Card}) {
    const imageName = getImageName(props.card);
    return(
        <div className="card-front">
            <img src={require("../images/"+imageName+".jpg")} alt={`Value: ${props.card.value} Colour: ${props.card.colour}`}    />
        </div>
    )
}

export default CardFaceDiscardPile