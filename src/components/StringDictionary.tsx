import { useState } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { AutoFormItem } from "../containers/Root/models/form.model";

export function StringDictionary<T>(props: {item: AutoFormItem<T>, value: any, add: (key: string, value: string) => void, change: (key: string, value: string) => void, blur: (key: string, value: string) => void}) {
  const { value, add, change, blur, item } = props;
  
  const dictionary = value[item.key || ''];

  const [keyToAdd, setKeyToAdd] = useState('');
  const [valueToAdd, setValueToAdd] = useState('');

  return (
    <div>
      {Object.keys(dictionary).sort((a, b) => a.localeCompare(b) ? -1 : b.localeCompare(a) ? 1 : 0).map(key => (
        <InputGroup>
          <InputGroup.Text style={{minWidth: '200px'}}>{key}</InputGroup.Text>
          <Form.Control as='input' value={dictionary[key]} onChange={ev => change(key, ev.currentTarget.value)} onBlur={ev => blur(key, ev.currentTarget.value)}></Form.Control>
        </InputGroup>
      ))}
      <InputGroup className="mt-3">
        <Form.Control style={{maxWidth: '200px'}} placeholder='key' as='input' value={keyToAdd} onChange={ev => setKeyToAdd(ev.currentTarget.value)}></Form.Control>
        <Form.Control placeholder='value' as='input' value={valueToAdd} onChange={ev => setValueToAdd(ev.currentTarget.value)}></Form.Control>
        <Button onClick={() => { add(keyToAdd, valueToAdd); setKeyToAdd(''); setValueToAdd(''); }}>Add</Button>
      </InputGroup>
    </div>
  );
}