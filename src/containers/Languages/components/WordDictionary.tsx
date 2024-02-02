import { useEffect, useMemo, useState } from "react";
import { Button, Col, Form, InputGroup, Row } from "react-bootstrap";
import { AutoFormItem } from "../../App/models/form.model";
import { IWord } from "../models/language.model";

// add: (key: string, value: string) => void,
export function WordDictionary<T>(props: {item: AutoFormItem<T>, value: any, generateWord?: () => IWord, change: (key: string, value: string) => void, blur: (key: string, value: string) => void}) {
  const { value, change, blur, generateWord } = props;
  
  const dictionary = value || {};

  // const [keyToAdd, setKeyToAdd] = useState('');
  // const [valueToAdd, setValueToAdd] = useState('');
  // const [hideUnset, setHideUnset] = useState(true);
  
  const [searchString, setSearchString] = useState('');
  const [page, setPage] = useState(0);

  const pageLength = 50;
  const [pages, setPages] = useState(1);
  
  const wordsDisplayed = useMemo(() => {
    return Object.keys(value).filter(word => (!searchString || word.includes(searchString)))
      .sort((a, b) => a.toLowerCase() > b.toLowerCase() ? 1 : b.toLowerCase() > a.toLowerCase() ? -1 : 0);;
  }, [searchString, value]);

  useEffect(() => {
    setPages(Math.ceil(wordsDisplayed.length / pageLength));
    if (page > pages) {
      setPage(pages - 1);
    }
  }, [wordsDisplayed, page, pages]);

  return (
    <div>
      {/*
      <InputGroup className="mb-3">
        <Form.Control style={{maxWidth: '200px'}} placeholder='key' as='input' value={keyToAdd} onChange={ev => setKeyToAdd(ev.currentTarget.value)}></Form.Control>
        <Form.Control placeholder='value' as='input' value={valueToAdd} onChange={ev => setValueToAdd(ev.currentTarget.value)}></Form.Control>
        <Button onClick={() => { add(keyToAdd, valueToAdd); setKeyToAdd(''); setValueToAdd(''); }}>Add</Button>
      </InputGroup>
      */}

      <Row className="align-items-center mb-3">
        <Col lg={9} className="d-flex align-items-center">
          <InputGroup>
            <InputGroup.Text><i className="fas fa-search"></i></InputGroup.Text>
            <Form.Control placeholder='Search for word...' as='input' value={searchString} onChange={ev => setSearchString(ev.currentTarget.value)}></Form.Control>
          </InputGroup>
          {/*
          <div className='w-10'></div>
          <Form.Check
            className="w-100"
            label='Hide unset words'
            checked={hideUnset}
            onChange={ev => setHideUnset(ev.currentTarget.checked)}
            type='switch'
            id={'hide-unset'}></Form.Check>
          */}
        </Col>
        <Col lg={3} className="d-flex align-items-center">
          <Button variant='link' disabled={page <= 0} onClick={() => setPage(page - 1)}><i className="fas fa-chevron-left"></i></Button>
          <div className="w-100 text-center">{page + 1} / {Math.max(1, pages)}</div>
          <Button variant='link' disabled={page >= pages - 1} onClick={() => setPage(page + 1)}><i className="fas fa-chevron-right"></i></Button>
        </Col>
      </Row>

      {wordsDisplayed.slice(page * pageLength, page * pageLength + pageLength).map((word, i) => (
        <InputGroup key={i + page * pageLength + word}>
          <InputGroup.Text>{word}</InputGroup.Text>
          <Form.Control as='input' value={dictionary[word] || ''} onChange={ev => change(word, ev.currentTarget.value)} onBlur={ev => blur(word, ev.currentTarget.value)}></Form.Control>
          <Button variant='link' onClick={() => blur(word, generateWord?.().transcription || '')}><i className={`fas fa-dice`}></i></Button>
        </InputGroup>
      ))}
      <Row className="mt-3">
        <Col lg={9}></Col>
        <Col lg={3} className="d-flex align-items-center">
          <Button variant='link' disabled={page <= 0} onClick={() => setPage(page - 1)}><i className="fas fa-chevron-left"></i></Button>
          <div className="w-100 text-center">{page + 1} / {Math.max(1, pages)}</div>
          <Button variant='link' disabled={page >= pages - 1} onClick={() => setPage(page + 1)}><i className="fas fa-chevron-right"></i></Button>
        </Col>
      </Row>
    </div>
  );
}

export type DictionaryWord = {
  label: string;
  variations: string[];
  wordType: string;
  meaning?: string;
}

export const processWordFromDictionary = (item: string): DictionaryWord => {
  let wordType = 'n';
  let meaning = '';

  const curlyBracketStart = item.indexOf('{');
  if (curlyBracketStart !== -1) {
    const curlyBracketEnd = item.indexOf('}');
    item = item.slice(0, curlyBracketStart) + item.slice(curlyBracketEnd + 1);
  }

  const bracketStart = item.indexOf('(');
  if (bracketStart !== -1) {
    const bracketEnd = item.indexOf(')');
    meaning = item.substring(bracketStart + 1, bracketEnd);
    item = item.slice(0, bracketStart) + item.slice(bracketEnd + 1);
  }

  const sqBracketStart = item.indexOf('[');
  if (sqBracketStart !== -1) {
    const sqBracketEnd = item.indexOf(']');
    wordType = item.substring(sqBracketStart + 1, sqBracketEnd);
    item = item.slice(0, sqBracketStart) + item.slice(sqBracketEnd + 1);
  }
  const variations = item.split(',').map(x => x.trim()).filter(x => !!x);

  return {label: `${variations[0]} : ${wordType}`, variations, meaning, wordType};
}
