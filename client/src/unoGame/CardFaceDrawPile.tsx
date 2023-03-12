import getImageName from "./getImageName";
import { Card } from "../uno/card";
 


function CardFaceDrawPile (props:{card: Card}) {
    const imageName = getImageName(props.card);
    return(
        <div className="card-front">
            <img src={require("../images/"+imageName+".jpg")} alt={`Value: ${props.card.value} Colour: ${props.card.colour}`}    />
        </div>
    )
}

export default CardFaceDrawPile