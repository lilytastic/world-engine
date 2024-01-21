import { useDispatch, useSelector } from "react-redux";
import { getCharacters, updateCharacter } from "./character.reducers";
import { useEffect, useState } from "react";
import { ICharacter } from "./models/character.model";
import { useParams } from "react-router";
import { Form } from "react-bootstrap";

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
            <Form.Label htmlFor='languageName'>Character name</Form.Label>
            <Form.Control
              as='input'
              id='characterName'
              value={character.name}
              onChange={ev => dispatch(updateCharacter({...character, name: ev.currentTarget.value}))}
            />
          </Form.Group>
        </div>
    )
}
