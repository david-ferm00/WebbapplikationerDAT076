import {Colour} from './Colour';
import {Value} from './Value';

export class Card {
    colour : Colour;
    value : Value;

    constructor(colour: Colour, value: Value) {
        this.colour = colour;
        this.value = value;
    }
}
