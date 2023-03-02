import './Mainpage.css';
import Button from 'react-bootstrap/Button';
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs';
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios';
import { Component, useEffect, useState } from "react";
import { Form } from 'react-bootstrap';

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

interface Games{
    gameCode : string,
    noOfPlayers : number
}

function Gamefinder(){
    const [games, setGames] = useState<Games>();

    useEffect(()=> {
        async function updateTasks() {
          const response = await axios.get<Games>("http://localhost:8080/matchmaking/gameslist/");
          setGames(response.data);
        }
    
        updateTasks();
    }, []);

    return (
        <div className="box">
            <div className="row h-30">
                <div className="col-6" id="code-input">
                    <label htmlFor="gamecode">Gamecode:</label>
                    <input className="textbox" type="text" id="gamecode" name="gamecode"/>
                </div>
                <div className="col-6">
                    <div className="row h-100 align-items-end justify-content-center">
                        <div className="col-auto"><input type="submit" value="submit"/> </div>
                    </div>
                </div>
            </div>
            <div className="row h-85 justify-content-center">
                <div className="game-list">
                    <ul>
                        {/*games.map((game) => */}<ListItem 
                        gameCode = {games == undefined ? "-1" : games.gameCode} 
                        noOfPlayers={games == undefined ? -1 : games.noOfPlayers}/>
                    </ul>
                </div>
            </div>
        </div>
    );
}

function ListItem({gameCode, noOfPlayers} : Games) {
    return <li onClick={e => joinGame({gameCode, noOfPlayers})}>{gameCode} {noOfPlayers}</li>
}

async function joinGame({gameCode, noOfPlayers} : Games) : Promise<void>{
    //TODO popup to insert name. find way to go to UNO page.
    if(noOfPlayers<2){
        await axios.put("/matchmaking/joinGame/"+gameCode+"/")
    }
}

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
                <div className="row h-50">
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

                <div className="row h-50 align-items-end justify-content-center">
                    <div className="col-auto">
                        <Button variant="light" 
                                type="submit" 
                                onClick={this.onPress}> Submit </Button> 
                    </div>
                </div>
            </Form>
        </div>
    );}
}

export default Mainpage;