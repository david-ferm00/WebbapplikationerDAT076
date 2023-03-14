import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import {  useState } from 'react';
import "./SelectColor.css"
import {Colour} from "../uno/Colour"
import { ChangeEventHandler } from "react";

/**
 * This component is responsible for the user being able to select colours.
 * When the user places a "colour change card" this component appears and allows the user to pick the new colour of play
 * This new colour is then set as the cards colour, before it is sent to the server to be placed.
 * @param toggleColorSelect is a function which either shows or hides this component
 * @param selectSpecialCard is a function which decides what the new colour of play will be. 
 * @returns nothing
 */
export function SelectColor (props: {toggleSelectColour: Function, selectSpecialCard: Function}) {

    const [colour, setColor] = useState<Colour>(Colour.none)

    function handleClick() {
      props.toggleSelectColour(false);
      props.selectSpecialCard(colour);
    }

    const onColorChange: ChangeEventHandler<HTMLInputElement> = ({ target: { value } }) => {
      setColor(+value)
    };

    return (
    <div
      className="modal show"
      style={{ display: 'block', position: 'initial' }}
    >
      <Modal.Dialog>
        <Modal.Header>
          <Modal.Title>Choose a colour</Modal.Title>
        </Modal.Header>

        <Modal.Body>
            <Form>
              <div className="mb-3">
                <Form.Check
                inline
                value={Colour.red}
                checked={colour === Colour.red}
                onChange={onColorChange}
                id="red"
                label={<img className="zoom" src={require("../images/red.jpg")} alt={"red"}/>}>
                </Form.Check>

                <Form.Check
                inline
                value={Colour.blue}
                checked={colour === Colour.blue}
                onChange={onColorChange}
                id="blue"
                label={<img className="zoom" src={require("../images/blue.jpg")} alt={"blue"}/>}>
                </Form.Check>

                <Form.Check
                inline
                value={Colour.yellow}
                checked={colour === Colour.yellow}
                onChange={onColorChange}
                id="yellow"
                label={<img className="zoom" src={require("../images/yellow.jpg")} alt={"yellow"}/>}>
                </Form.Check>

                <Form.Check
                inline
                value={Colour.green}
                checked={colour === Colour.green}
                onChange={onColorChange}
                id="green"
                label={<img className="zoom" src={require("../images/green.jpg")} alt={"green"}/>}>
                </Form.Check>
              </div>

            </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="primary" onClick={handleClick}>Confirm</Button>
        </Modal.Footer>
      </Modal.Dialog>
    </div>
  );
}

export default SelectColor;