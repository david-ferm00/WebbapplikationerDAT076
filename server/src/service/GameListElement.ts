/**
 * This is a simple class which contains the information that would be needed to be displayed in the join game list.
 */
export class GameListElement{
    gameCode : string;
    noOfPlayers : number;

    constructor(code : string, noOfPlayers : number){
        this.gameCode = code;
        this.noOfPlayers = noOfPlayers;
    }

    getCode(): string {
        return this.gameCode;
    }
}