import {Colour} from './Colour';
import {Value} from './Value';

export class Card {
    colour : Colour;
    value : Value;
    image : string

    constructor(colour: Colour, value: Value) {
        this.colour = colour;
        this.value = value;
        this.image = "1_red";
    }
}
