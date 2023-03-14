This project is that of a web application version of UNO

This project requires reactjs, react-router-dom, axios, cors, node and express
They can be easily installed with a google search

The project is essentially split into two parts: the client and the server.
These can be found in the folders named client and server.
Additionally there is a folder named client_mockup. This folder contains the mockup we made in html and css.

Within client, everything which we made in within the src subfolder. Here, images is a folder which contains images of the cards, uno contains 
the model of the game and unoGame is a folder containing all components for the game page of the project. The file Mainpage.tsx is for the whole 
start page of the project.

In server we also have a src folder which contains the project. Inside src there are three folders: model, router and server.
Model contains the model of the project on the server side. Router contains three different router classes, the currently used file is called 
router.ts. Service has the game manager and the main game class, which is the controller for an instance of the game.

Tests for the server are made written in the server folder, and are the files with the .test.ts suffix.

The report for this project can be found in the assets folder.