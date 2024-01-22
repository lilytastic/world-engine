import React, { useCallback, useEffect, useState } from 'react';
import { Button, Col, Form, InputGroup, OverlayTrigger, Popover, Row, Tab, Tabs } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { AutoForm, AutoFormField, AutoFormItem } from '../containers/Root/models/language.form';
import { EntityState } from '@reduxjs/toolkit';
import { StringDictionary } from './StringDictionary';
import { WordDictionary } from '../containers/Languages/components/WordDictionary';

/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
export function isObject(item: any) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

/**
 * Deep merge two objects.
 * @param target
 * @param ...sources
 */
export function mergeDeep<T>(target: any, source: Partial<T>): T {
  let obj = {...target};

  if (isObject(obj) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!obj[key]) {
          obj[key] = {};
        }
        obj[key] = mergeDeep(obj[key], source[key] as any);
      } else {
        obj[key] = source[key];
      }
    }
  }

  return obj;
}

export function AutoFormer<T>(props: {children?: any, className?: string, form: AutoForm<T>, data: T, update: any}) {

  const { form, data, update } = props;
  const [scratch, setScratch] = useState(undefined as T | undefined);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState(undefined as T | undefined);
  const params = useParams();

  useEffect(() => {
    setScratch(data);
  }, [data]);

  const change = useCallback((key: string | undefined, value: any, parents?: AutoFormItem<T>[]) => {
    if (!scratch) { return; }

    let update: any = {};
    if (key) {
      update[key] = value;
    }

    parents?.forEach(parent => {
      if (!!parent.key) {
        update = { [parent.key]: {...update} }
      }
    });

    // console.log(key, data, update);
    
    // console.log(scratch, update, mergeDeep({...data}, update));

    // setScratch({...scratch, ...update});
    setScratch(mergeDeep({...data}, update));
  }, [scratch]);

  const submit = useCallback((key: string | undefined, value: any, parents?: AutoFormItem<T>[]) => {
    if (!data) { return; }

    let update: any = {};
    if (key) {
      update[key] = value;
    }
    
    parents?.forEach(parent => {
      if (!!parent.key) {
        update = { [parent.key]: {...update} }
      }
    });

    // console.log(data, update, mergeDeep(data, update));

    dispatch(props.update(mergeDeep(data, update)));
  }, [data]);

  const displayFormGroup = (item: AutoFormItem<T>, content: JSX.Element): JSX.Element => {
    return (<Form.Group className='mb-3 form-group' key={item.key}>
      {item.label && (
        <Form.Label htmlFor="phonemeClasses" className='d-flex justify-content-between align-items-center'>
          <div className='d-flex align-items-center'>
            {item.label}
            {item.popover && (
              <OverlayTrigger trigger="focus" placement='bottom' overlay={item.popover}>
                <Button variant='link' className='p-0 small text-secondary'>
                  <i className='fas fa-circle-question small ms-2'></i>
                </Button>
              </OverlayTrigger>
            )}
          </div>
          {item.footerText && (
            <small className='text-muted'>
              {item.footerText}
            </small>
          )}
        </Form.Label>
      )}
      {content}
    </Form.Group>);
  }
  
  const displayFormControl = (item: AutoFormItem<T>, content: JSX.Element): JSX.Element => {
    return (<div key={item.key}>
      <Form.Label htmlFor="phonemeClasses" className='d-flex justify-content-between align-items-center'>
        <div className='d-flex align-items-center'>
          {item.label}
          {item.popover && (
            <OverlayTrigger trigger="focus" placement='bottom' overlay={item.popover}>
              <Button variant='link' className='p-0 small text-secondary'>
                <i className='fas fa-circle-question small ms-2'></i>
              </Button>
            </OverlayTrigger>
          )}
        </div>
        {item.footerText && (
          <small className='text-muted'>
            {item.footerText}
          </small>
        )}
      </Form.Label>
      {content}
    </div>);
  }
  
  const displayFormItem = useCallback((item: AutoFormItem<T>, parents?: AutoFormItem<T>[]): JSX.Element => {
    if (!scratch) { return <></>; }

    let value: any = scratch;
    parents?.forEach(parent => {
      if (!!parent.key) {
        if (!value[parent.key]) { value = {}; }
        else {
          value = value[parent.key];
        }
      }
    });
    if (item.key) {
      value = value[item.key];
    }

    const newParents = [item, ...(parents || [])];

    switch (item.type) {
      case AutoFormField.Button:
        return <Button {...item.templateOptions}>{item.label}</Button>;
      case AutoFormField.Group:
        return displayFormGroup(item, <>{item.children?.map(next => displayFormItem(next, newParents))}</>);
      case AutoFormField.StringDictionary:
        return <StringDictionary
          value={value}
          item={item}
          add={(key, value) => submit(item.key, { [key]: value }, parents)}
          change={(key, value) => change(item.key, { [key]: value }, parents)}
          blur={(key, value) => submit(item.key, { [key]: value }, parents)}
        ></StringDictionary>;
      case AutoFormField.WordDictionary:
        return <WordDictionary
          value={value}
          item={item}
          add={(key, value) => submit(item.key, { [key]: value }, parents)}
          change={(key, value) => change(item.key, { [key]: value }, parents)}
          blur={(key, value) => submit(item.key, { [key]: value }, parents)}
          {...item.templateOptions}
        ></WordDictionary>;
      case AutoFormField.Radio:
        return displayFormControl(
          item,
          <>
            {item.options?.map(option => (
              <Form.Check
                label={option.label}
                checked={value === option.value}
                onChange={ev => submit(item.key, option.value, parents)}
                name={item.key}
                type='radio'
                id={option.value}
              />
            ))}
          </>
        );
      case AutoFormField.CheckGroup:
        return (<div>
          {item.options?.map(option => (
            <Form.Check
              label={option.label}
              checked={value[option.key || ''] === true}
              onChange={ev => submit(option.key, ev.currentTarget.checked, [item, ...newParents])}
              name={item.key}
              type='checkbox'
              id={option.key}
            />
          ))}
        </div>);
      case AutoFormField.Control:
        return displayFormControl(
          item,
          <Form.Control
            as={item.as}
            id={item.key}
            value={value}
            placeholder={item.placeholder}
            onChange={ev => change(item.key, ev.currentTarget.value, parents)}
            onBlur={ev => submit(item.key, ev.currentTarget.value, parents)}
          />
        );
      case AutoFormField.TabGroup:
        return (<Tabs
            defaultActiveKey={item.children?.[0]?.key}
            variant='pills'
            key={item.key}
            className="mt-4 mb-4 mx-auto rounded"
            style={{width: 'fit-content'}}
          >
            {item.children?.map(tab => (<Tab key={tab.id || tab.key} eventKey={tab.id || tab.key} title={tab.label}>
              {displayFormItem(tab, newParents)}
            </Tab>))}
        </Tabs>);
      default:
        return (<div key={item.key}>
          {item.children?.map(next => displayFormItem(next, newParents))}
        </div>);
    }
  }, [scratch]);

  const popover = (
    <Popover id="popover-basic">
      <Popover.Body>
        <ul className='list'>
          <li>Phonemes are ranked by frequency from left (most frequent) to right (least frequent).</li>
          <li><b>Fast</b> rate makes frequent phonemes even more frequent, <b>Medium</b> creates a more even spread, and <b>Equiprobable</b> creates a perfectly even spread.</li>
          <li>When using Equiprobable, phonemes can be custom weighted by writing *multiplier. For example, p*10 makes p ten times more common than a phoneme without a multiplier. To make it less likely, multiply by a decimal: p*0.4.</li>
        </ul>
      </Popover.Body>
    </Popover>
  );

  return (<>
    {form.map(item => displayFormItem(item))}
  </>);
}
