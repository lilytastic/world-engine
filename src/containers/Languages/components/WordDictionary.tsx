import { useEffect, useMemo, useState } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { AutoFormItem } from "../../Root/models/language.form";
import { universalWords } from "../../../assets/universaldictionary";

export function WordDictionary<T>(props: {item: AutoFormItem<T>, value: any, generateWord?: () => string, regenerateAllWords?: () => void, add: (key: string, value: string) => void, change: (key: string, value: string) => void, blur: (key: string, value: string) => void}) {
  const { value, add, change, blur, item, generateWord } = props;
  
  const dictionary = value[item.key || ''];

  const [keyToAdd, setKeyToAdd] = useState('');
  const [valueToAdd, setValueToAdd] = useState('');
  const [hideUnset, setHideUnset] = useState(false);
  const [page, setPage] = useState(0);

  const dict = universalWords.split('\n')
    .map(processWordFromDictionary)
    .filter(x => !x.label.includes('undefined') && !!x.label)
    .sort((a, b) => a.label.toLowerCase() > b.label.toLowerCase() ? 1 : b.label.toLowerCase() > a.label.toLowerCase() ? -1 : 0);

  const pageLength = 50;
  const [pages, setPages] = useState(1);
  
  const wordsDisplayed = useMemo(() => {
    return dict.filter(word => !!dictionary[word.label] || !hideUnset);
  }, [hideUnset, page, pageLength]);

  useEffect(() => {
    setPages(Math.ceil(wordsDisplayed.length / pageLength));
    if (page > pages) {
      setPage(pages - 1);
    }
  }, [wordsDisplayed, hideUnset, page, pages]);

  return (
    <div>
      <InputGroup className="mb-3">
        <Form.Control style={{maxWidth: '200px'}} placeholder='key' as='input' value={keyToAdd} onChange={ev => setKeyToAdd(ev.currentTarget.value)}></Form.Control>
        <Form.Control placeholder='value' as='input' value={valueToAdd} onChange={ev => setValueToAdd(ev.currentTarget.value)}></Form.Control>
        <Button onClick={() => { add(keyToAdd, valueToAdd); setKeyToAdd(''); setValueToAdd(''); }}>Add</Button>
      </InputGroup>

      <div className="d-flex align-items-center justify-content-between">
        <div>
          <Form.Check
            label='Hide unset words'
            checked={hideUnset}
            onChange={ev => setHideUnset(ev.currentTarget.checked)}
            type='switch'
            id={'hide-unset'}></Form.Check>
        </div>
        <div className="d-flex align-items-center">
          <Button variant='link' disabled={page <= 0} onClick={() => setPage(page - 1)}><i className="fas fa-chevron-left"></i></Button>
          {page + 1} / {pages}
          <Button variant='link' disabled={page >= pages - 1} onClick={() => setPage(page + 1)}><i className="fas fa-chevron-right"></i></Button>
        </div>
      </div>

      {wordsDisplayed.slice(page * pageLength, page * pageLength + pageLength).map((word, i) => (
        <InputGroup key={i + page * pageLength + word.label}>
          <InputGroup.Text style={{minWidth: '200px'}}>{word.label}</InputGroup.Text>
          <Form.Control as='input' value={dictionary[word.label] || ''} onChange={ev => change(word.label, ev.currentTarget.value)} onBlur={ev => blur(word.label, ev.currentTarget.value)}></Form.Control>
          <Button variant='link' onClick={() => blur(word.label, generateWord?.() || '')}><i className={`fas fa-refresh`}></i></Button>
        </InputGroup>
      ))}
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

  return {label: `${variations[0]} [${wordType}]`, variations, meaning, wordType};
}
