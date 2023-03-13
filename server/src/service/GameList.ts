export class GameList{
    gameCode : string;
    noOfPlayers : number;

    constructor(code : string, noOfPlayers : number){
        this.gameCode = code;
        this.noOfPlayers = noOfPlayers;
    }
}