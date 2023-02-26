import React from 'react';
import logo from './logo.svg';
import './Mainpage.css';
import Button from 'react-bootstrap/Button';
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs';
import 'bootstrap/dist/css/bootstrap.css';

function Mainpage(){
    return(

        <body className="background">
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js" integrity="sha384-w76AqPfDkMBDXo30jS1Sgez6pr3x5MlQ1ZAGC+nuZB+EYdgRZgiwxhTBTkF7CXvN" crossOrigin="anonymous"></script>

        <div className="container-fluid text-center">
            <div className="row h-100 justify-content-center">
                <div className="col-md-auto">
                    <h1 id="title" className="">
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

function Gamefinder() {
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
                        <li> <a href="game.html">gamecode1</a> </li>
                        <li> <a href="game.html">gamecode2</a> </li>
                        <li> <a href="game.html">gamecode3</a> </li>
                        <li> <a href="game.html">gamecode4</a> </li>
                    </ul>
                </div>
            </div>
        </div>
  );
}

function GameCreator(){
    return (
        <div className="box">
            <div className="row h-50">
                <div className="col-6">
                    <label htmlFor="gamecode-create">Gamecode:</label>
                    <input className="textbox" type="text" id="gamecode-create" name="gamecode"/>
                </div>
                <div className="col-6">
                    <label htmlFor="playerId">Your name:</label>
                    <input className="textbox" type="text" id="playerId" name="playerID"/>
                </div>
            </div>

            <div className="row h-50 align-items-end justify-content-center">
                <div className="col-auto"> <input type="submit" value="submit"/> </div>
            </div>
        </div>
    );
}

export default Mainpage;