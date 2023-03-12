import axios from "axios";

/**
 * The drawpile's component and its logic
 * @param gameCode the game code
 * @param player1Name the users name
 * @returns 
 */
function DrawPile(props:{gameCode : string, playerName : string}) {
    async function pickUp(){
        await axios.put("http://localhost:8080/uno/pickUpCard/"+props.gameCode+"/"+props.playerName);
    }

    return (
    <div className='card-back'>
        <img src={require("../images/back.jpg")} alt={"Back of card"} onClick={() => pickUp()}/>
    </div>
    )
}

export default DrawPile