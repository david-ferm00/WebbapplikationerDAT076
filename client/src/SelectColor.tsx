import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton'
import Form from 'react-bootstrap/Form';
import { useState } from 'react';


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
                <Button className="card-size-button"
                key='red'>
                    <img src={require("./images/red.jpg")} alt={"red"}/>
                </Button>
                <Button className="card-size-button"
                key='blue'>
                    <img src={require("./images/blue.jpg")} alt={"blue"}/>
                </Button>
                <Button className="card-size-button"
                key='yellow'>
                    <img src={require("./images/yellow.jpg")} alt={"yellow"}/>
                </Button>
                <Button className="card-size-button"
                key='green'>
                    <img src={require("./images/green.jpg")} alt={"green"}/>
                </Button>
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