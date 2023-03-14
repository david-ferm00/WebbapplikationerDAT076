import axios from "axios"
import { Button } from "react-bootstrap"

/**
 * Simple component for the uno button and its logic
 * @param player1Name the users name
 * @param gameCode the game code
 * @returns nothing
 */
function UnoButton(props:{playerName : string, gameCode : string}){
    async function onClick(){
        await axios.put("http://localhost:8080/uno/say_uno/"+props.gameCode+"/"+props.playerName)
    }

    return(
        <Button onClick={onClick}>Uno</Button>
    )
}

export default UnoButton