import { useDispatch, useSelector } from "react-redux";
import { getCharacters, updateCharacter } from "./character.reducers";
import { useEffect, useState } from "react";
import { ICharacter } from "./models/character.model";
import { useParams } from "react-router";
import { Col, Form, Row } from "react-bootstrap";

export function Character(props: {children?: any}) {

    const dispatch = useDispatch();
    const characters = useSelector(getCharacters);
    const [character, setCharacter] = useState(undefined as ICharacter | undefined);
    const params = useParams();
  
    useEffect(() => {
      if (params.id) {
        setCharacter(characters.entities[params.id]);
      }
    }, [characters, params.id]);

    if (!character) {
        return <></>;
    }

    return (
        <div>
          <Form.Group className='form-group'>
            <Row>
              <Col lg={7}>
                <Form.Label htmlFor='name'>Name</Form.Label>
                <Form.Control
                  as='input'
                  id='characterName'
                  value={character.name}
                  onChange={ev => dispatch(updateCharacter({...character, name: ev.currentTarget.value}))}
                />
              </Col>
              <Col lg={5}>
                <Form.Label htmlFor='gender'>Gender</Form.Label>
                <Form.Select
                    aria-label="Gender"
                    value={character.gender}
                    onChange={(ev) => {
                      console.log(ev);
                      dispatch(updateCharacter({...character, gender: ev.currentTarget.value}));
                    }}>
                  <option>Choose one</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                  <option value="X">Non-binary</option>
                </Form.Select>
              </Col>
            </Row>
          </Form.Group>
        </div>
    )
}
