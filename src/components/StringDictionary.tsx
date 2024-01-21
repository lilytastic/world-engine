import { useState } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { AutoFormItem } from "../containers/Root/models/language.form";

export function StringDictionary<T>(props: {item: AutoFormItem<T>, value: any, add: (key: string) => void}) {
  const { value, add, item } = props;
  
  const [keyToAdd, setKeyToAdd] = useState('');

  return (
    <div>
      {Object.keys(value[item.key || '']).sort((a, b) => a.localeCompare(b) ? -1 : b.localeCompare(a) ? 1 : 0).map(key => (
        <InputGroup>
          <InputGroup.Text>{key}</InputGroup.Text>
          <Form.Control as='input'></Form.Control>
        </InputGroup>
      ))}
      <InputGroup className="mt-3">
        <Form.Control as='input' value={keyToAdd} onChange={ev => setKeyToAdd(ev.currentTarget.value)}></Form.Control>
        <Button onClick={() => { add(keyToAdd); setKeyToAdd(''); }}>Add</Button>
      </InputGroup>
    </div>
  );
}