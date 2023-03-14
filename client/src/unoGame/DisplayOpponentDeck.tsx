import { Col, Row } from "react-bootstrap";
import CardBack from "./CardBack"


/**
 * Component for displaying the opponents hand
 * @param size the size of the opponents hand
 * @returns nothing
 */
function DisplayOpponentDeck (props:{size:number}) {

    function getList() : number[]{
        var result = [];
        for (let index = 0; index < props.size; index++) {
            result.push(1);
        }
        return result;
    }

    return ( 
    <div className='opponent-hand'>
        <Row>
            <Col md={3}></Col>
            <Col md={6}>
                <Row className='justify-content-center'>
                    {
                        getList().map(() => (
                        <Col className="md-auto"><CardBack/></Col>
                        ))
                    }
                </Row>
            </Col>
            <Col md={3}></Col>
        </Row>
    </div>
    )
}

export default DisplayOpponentDeck