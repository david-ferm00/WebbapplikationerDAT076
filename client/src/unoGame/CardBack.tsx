
/**
 * Simple component to show the back of cards.
 * This is used for the draw pile and the opponents hand
 * @returns 
 */
function CardBack() {
    return (
        <div className='card-back'>
            <img src={require("../images/back.jpg")} alt={"Back of card"} />
        </div>
    )
} 

export default CardBack