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