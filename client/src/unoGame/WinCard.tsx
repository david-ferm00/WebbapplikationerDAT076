/**
 * A simple component to tell the user whether they won or lost
 * @param yourPileSize the size of the users hand
 * @param sizeOppPile the size of the opponents hand
 * @returns 
 */
function WinCard(props: {yourPileSize : number, sizeOppPile : number}){
    var message = "";
    if(props.yourPileSize===0){
        message = "you win!!!"
    } else if(props.sizeOppPile===0){
        message = "you lose!!!"
    }
    return(
        <h1>{message}</h1>
    )
}

export default WinCard