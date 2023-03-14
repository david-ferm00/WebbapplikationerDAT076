import { Card } from "../uno/card";

/**
 * For components where the card's face is shown. There needs to be a way for the card to find the correct image.
 * This function takes a card and gives back the corresponding image file name 
 * @param card The card to be shown
 * @returns the name of the image file
 */
function getImageName(card: Card) : string{
    var result = ""
    switch(card.value){
        case 10: result = result+"+2"; break;
        case 11: result = result+"+4"; break;
        case 12: result = result+"free_choice"; break;
        default: result = result+card.value.toString(); break;
    }
    if(card.value!==11 && card.value!==12){
        switch(card.colour){
            case 0: result = result+"_red"; break;
            case 1: result = result+"_yellow"; break;
            case 2: result = result+"_blue"; break;
            case 3: result = result+"_green"; break;
            default: break;
        }
    }

    return result;
}

export default getImageName