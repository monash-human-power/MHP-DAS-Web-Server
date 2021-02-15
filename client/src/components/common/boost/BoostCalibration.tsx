import React , {useState, useCallback} from 'react';
import {Button, Card, Form, Col} from 'react-bootstrap';
// import {useSensorData} from 'api/v2/sensors/data';

export interface BoostCalibrationProps {
    onSet: (calibValue: number) => void;
    onReset: () => void;
    distTravelled: number;
  }

/**
 * Boost calibration card, displays the calibrated distance and the 
 * distance travelled by the bike
 * 
 * @returns {React.Component} Component
 */
export default function BoostCalibration({
    onSet, onReset, distTravelled
}: BoostCalibrationProps) {
    // Controls the feedback form
    const [validated, setValidation] = useState(false);
    
    const [calibValue, setCalibValue] = useState(0);
    // Holds the difference between the current distance and the calibrated distance
    const [calibDiff, setCalibDiff] = useState(0);

    const handleCalibrationChange = useCallback(
        (event) => {
        setCalibValue(event.target.value);
        },
        [setCalibValue],
    );

  const handleSubmit = useCallback(
      (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
        event.stopPropagation();
        }
        else {
            onSet(calibValue);
            setCalibDiff(calibValue-distTravelled);
        }
        event.preventDefault();
        setValidation(true);
    },
    [calibValue, onSet, setValidation]);

    const handleKeyPressed = useCallback(
        (event) => { 
            if (event.key === 'Enter') handleSubmit(event); 
        },
        [handleSubmit]
    );

    return (
        <Card >
            <Card.Body>
                <Card.Title>Calibration</Card.Title>
                <Card.Text>
                    BOOST may use a distance different to the bike&apos;s travelled distance for the purposes of generating power plan data.
                </Card.Text>
                <div className="pb-3">
                    <b>Distance travelled </b> <span className="float-right pr-4" > {distTravelled} m </span>
                </div>
                <div className="pb-3">
                  <b>Calibrated distance </b> <span className="float-right pr-4"> {distTravelled + calibDiff} m </span>
                </div>
                <Form 
                    noValidate 
                    validated={validated} 
                    onSubmit={handleSubmit} 
                    onBlur={() => {setValidation(false);}}>

                    <Form.Row>
                        <Form.Group as={Col} md="4" >
                            <Form.Control 
                            type="number" 
                            placeholder="Calibrate distance..." 
                            onKeyPress={handleKeyPressed}
                            onChange={handleCalibrationChange}
                            min = "0"
                            required/>

                            <Form.Control.Feedback type="invalid">
                            Please provide a valid calibration distance.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group as={Col}>
                        <Button  type="submit" >Set</Button>
                        <Button variant="outline-danger" className="float-right pr-3" onClick ={onReset} >Reset</Button>
                        </Form.Group>
                    </Form.Row>
                </Form>
            </Card.Body>
        </Card>
    );
}
