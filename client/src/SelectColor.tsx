import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton'
import Form from 'react-bootstrap/Form';
import { useState } from 'react';
import "./SelectColor.css"


export function SelectColor () {

    const [checked, setChecked] = useState(false)

    return (
    <div
      className="modal show"
      style={{ display: 'block', position: 'initial' }}
    >
      <Modal.Dialog>
        <Modal.Header closeButton>
          <Modal.Title>Choose a colour</Modal.Title>
        </Modal.Header>

        <Modal.Body>
            <Form>
              <div className="mb-3">
                <Form.Check
                inline
                key='red'>
                    <img className="zoom" src={require("./images/red.jpg")} alt={"red"}/>
                </Form.Check>
                <Form.Check
                inline
                key='blue'>
                    <img className="zoom" src={require("./images/blue.jpg")} alt={"blue"}/>
                </Form.Check>
                <Form.Check
                inline
                key='yellow'>
                    <img className="zoom" src={require("./images/yellow.jpg")} alt={"yellow"}/>
                </Form.Check>
                <Form.Check
                inline
                key='green'>
                    <img className="zoom" src={require("./images/green.jpg")} alt={"green"}/>
                </Form.Check>
              </div>

            </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="primary">Confirm</Button>
        </Modal.Footer>
      </Modal.Dialog>
    </div>
  );
}

export default SelectColor;