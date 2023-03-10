import './Mainpage.css';
import Button from 'react-bootstrap/Button';
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs';
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios';
import { Component, useEffect, useState } from "react";
import { Form } from 'react-bootstrap';
import { render } from '@testing-library/react';
import {
    BrowserRouter as Router,
    Link,
    useNavigate
  } from "react-router-dom";
import { Prev } from 'react-bootstrap/esm/PageItem';

/**
 * Main component which arranges all the other components together
 * @returns 
 */
function Mainpage(){
    return(
        <body className="background">
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js" integrity="sha384-w76AqPfDkMBDXo30jS1Sgez6pr3x5MlQ1ZAGC+nuZB+EYdgRZgiwxhTBTkF7CXvN" crossOrigin="anonymous"></script>
            <div className="container-fluid text-center">
                <div className="row h-100 justify-content-center">
                    <div className="col-md-auto">
                        <h1 id="title">
                            Uno game
                        </h1>

                        <div style={{ display: 'block', width: 700, padding: 30 }}>
                            <Tabs defaultActiveKey="second" className='justify-content-center'>
                                <Tab eventKey="first" title="Create game">
                                    <GameCreator />
                                </Tab>
                                <Tab eventKey="second" title="Join game">
                                    <Gamefinder />
                                </Tab>
                                <Tab eventKey="third" title="Settings...">
                                    We don have anything here yet
                                </Tab>
                            </Tabs>
                        </div>
                    </div>
                </div>
            </div>
        </body>
    )
}

/**
 * This is an interface for the list items in the join game tab.
 * All that is needed is the gamecode and the number of players so that is all that is given here.
 * It is used so that we can make sure that all games in the list have these two things.
 */
interface Games{
    code : string,
    noOfPlayers : number
}

/**
 * This component represents the tab where you join a game
 * It contains a list of current games and a text box where you can give you player name.
 */
function Gamefinder(){

    const GameList : Games= {
        code : "default",
        noOfPlayers : 0
    } 

    const [state, updateGameList] = useState(GameList)
    const [name, updateName] = useState("")

    useEffect(() => {
        let interval = setInterval(async () => {
            const res = await axios.get<Games>("http://localhost:8080/matchmaking/gamelist");
            updateGameList(res.data)
        }, 2000);
        return () => {
            clearInterval(interval);
        };
    }, []);

    return (
        <div className="box">
            <div className="row h-30 p-3">
                <div className="col-6" id="code-input">
                    <Form>
                        <Form.Group>
                            <Form.Label htmlFor="playerId">Your name:</Form.Label>
                            <Form.Control 
                                className="textbox" 
                                type="text" 
                                id="playerId" 
                                name="playerID" 
                                onChange={e => updateName(e.target.value)}/>
                        </Form.Group>
                    </Form>
                </div>
            </div>
            <div className="row h-85 justify-content-center p-3">
                <div className="game-list">
                    <ul>
                        {ListItem(state.code, state.noOfPlayers, name)}
                    </ul>
                </div>
            </div>
        </div>
    );
}

/**
 * This component is what is actually shown in the listview.
 * @param gameCode this is the game code of the game that this list item represents
 * @param noOfPlayers this  is the number of players in the game
 * @param playerID this is the player name that is given by the user in the gamefinder component
 * @returns nothing
 */
function ListItem(gameCode : string, noOfPlayers : number, playerID : string) {
    return(<li onClick={e => joinGame(gameCode, noOfPlayers, playerID)}><Link to={playerID=="" ? "/" : 'unoGame/'+gameCode+"/"+playerID}> {gameCode + " " + noOfPlayers} </Link></li>)
}

/**
 * This function simply makes a request to join the game and so set themselves as player2
 * @param gameCode the gamecode of the game the user is trying to join
 * @param noOfPlayers the number of players in that game
 * @param playerID the name that the user provided
 */
async function joinGame(gameCode : string, noOfPlayers : number, playerID : string) : Promise<void>{
    if(noOfPlayers<2){
        await axios.put("http://localhost:8080/matchmaking/joinGame/"+gameCode+"/"+playerID)
    }
}

/**
 * This component represents the tab where you create a game
 * There are two textboxes where you can input your gamecode and player name respectively
 * Once the submit button is pressed you are taken to the game page
 */
class GameCreator extends Component{
    state = {
        code: "",
        name: ""
    };

    onPress = async () =>{
        await axios.post("http://localhost:8080/matchmaking/creategame/"+this.state.code+"/"+this.state.name)
    }

    render(){
    return (
        <div className="box">
            <Form>
                <div className="row h-50 p-3">
                    <div className="col-6">
                        <Form.Group>
                            <Form.Label htmlFor="gamecode-create">Gamecode:</Form.Label>
                            <Form.Control 
                                className="textbox" 
                                type="text" 
                                id="gamecode-create" 
                                name="gamecode" 
                                onChange={e => this.setState({ code: e.target.value, name: this.state.name })}/>
                        </Form.Group>
                    </div>
                    <div className="col-6">
                        <Form.Group>
                            <Form.Label htmlFor="playerId">Your name:</Form.Label>
                            <Form.Control 
                                className="textbox" 
                                type="text" 
                                id="playerId" 
                                name="playerID" 
                                onChange={e => this.setState({ code: this.state.code, name: e.target.value })}/>
                        </Form.Group>
                    </div>
                </div>

                <div className="row h-50 align-items-center justify-content-center p-3">
                    <div className="col-auto">
                        <Link to ={"/UnoGame/"+this.state.code+"/"+this.state.name}>
                        <   Button variant="light" 
                                type="submit" 
                                onClick={this.onPress}> Submit </Button> 
                        </Link> 
                    </div>
                </div>
            </Form>
        </div>
    );}
}

export default Mainpage;