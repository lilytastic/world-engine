import React, { useCallback, useEffect, useState } from 'react';
import { Button, Form, OverlayTrigger, Popover, Tab, Tabs } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { AutoForm, AutoFormField, AutoFormItem } from '../containers/Root/models/language.form';
import { EntityState } from '@reduxjs/toolkit';

interface IStack<T> {
  push(item: T): void;
  pop(): T | undefined;
  peek(): T | undefined;
  size(): number;
}

class Stack<T> implements IStack<T> {
  private storage: T[] = [];

  constructor(private capacity: number = Infinity) {}

  push(item: T): void {
    if (this.size() === this.capacity) {
      throw Error("Stack has reached max capacity, you cannot add more items");
    }
    this.storage.push(item);
  }

  pop(): T | undefined {
    return this.storage.pop();
  }

  peek(): T | undefined {
    return this.storage[this.size() - 1];
  }

  size(): number {
    return this.storage.length;
  }
}

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
export function mergeDeep<T>(target: any, source: Partial<T>[]): T {
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

  const change = useCallback((key: string, value: any, parents?: AutoFormItem<T>[]) => {
    if (!scratch) { return; }

    let update: any = {};
    update[key] = value;
    
    parents?.forEach(parent => {
      if (!!parent.key) {
        update = { [parent.key]: {...update} }
      }
    });

    // console.log(scratch, update, mergeDeep({...data}, update));

    // setScratch({...scratch, ...update});
    setScratch(mergeDeep({...data}, update));
  }, [scratch]);

  const submit = useCallback((key: string, value: any, parents?: AutoFormItem<T>[]) => {
    if (!data) { return; }

    let update: any = {};
    update[key] = value;
    
    parents?.forEach(parent => {
      if (!!parent.key) {
        update = { [parent.key]: {...update} }
      }
    });

    console.log(data, update, mergeDeep(data, update));

    dispatch(props.update(mergeDeep(data, update)));
  }, [data]);
  
  const displayFormItem = useCallback((item: AutoFormItem<T>, parents?: AutoFormItem<T>[]): JSX.Element => {
    if (!scratch) { return <></>; }

    let value: any = scratch;
    parents?.forEach(parent => {
      if (!!parent.key) {
        value = value[parent.key];
      }
    });
    if (item.key) {
      value = value[item.key];
    }

    const newParents = [item, ...(parents || [])];

    switch (item.type) {
      case AutoFormField.Control:
        return (<Form.Group key={item.key} className='mb-4 form-group'>
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
          <Form.Control
            as={item.as}
            id={item.key}
            value={value}
            onChange={ev => change(item.key || '', ev.currentTarget.value, parents)}
            onBlur={ev => submit(item.key || '', ev.currentTarget.value, parents)}
          />
        </Form.Group>);
      case AutoFormField.TabGroup:
        return (<Tabs
            defaultActiveKey={item.children?.[0]?.key}
            variant='pills'
            key={item.key}
            className="mt-4 mb-4 mx-auto rounded"
            style={{width: 'fit-content'}}
          >
            {item.children?.map(tab => (<Tab key={tab.key} eventKey={tab.key} title={tab.label}>
              {tab.children?.map(next => displayFormItem(next, [tab, ...newParents]))}
            </Tab>))}
        </Tabs>);
      default:
        return (<div key={item.key}>
          {item.label}
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

/*
    <Form.Label htmlFor="dropoffRate" className='d-flex align-items-center'>
      Probability Dropoff Rate
      <OverlayTrigger trigger="focus" placement='bottom' overlay={popover}>
        <Button variant='link' className='p-0 small text-secondary'>
          <i className='fas fa-circle-question small ms-2'></i>
        </Button>
      </OverlayTrigger>
    </Form.Label>
    <div className='mb-2'>
      <Form.Check
        label="Fast dropoff"
        checked={currentDropoffRate === ProbabilityType.FastDropoff}
        onChange={ev => updateDropoffRate(ProbabilityType.FastDropoff)}
        name="group1"
        type='radio'
        id='inline-type-1'
      />
      <Form.Check
        label="Medium dropoff"
        checked={currentDropoffRate === ProbabilityType.MediumDropoff}
        onChange={ev => updateDropoffRate(ProbabilityType.MediumDropoff)}
        name="group1"
        type='radio'
        id='inline-type-2'
      />
      <Form.Check
        label="Equiprobable"
        checked={currentDropoffRate === ProbabilityType.Equiprobable}
        onChange={ev => updateDropoffRate(ProbabilityType.Equiprobable)}
        name="group1"
        type='radio'
        id='inline-type-3'
      />
      {/*
      <ButtonGroup className='w-100'>
        <Button active={currentDropoffRate === ProbabilityType.FastDropoff}
                onClick={ev => updateDropoffRate(ProbabilityType.FastDropoff)}
                variant='secondary'
                className='w-100'>
          Fast
        </Button>
        <Button active={currentDropoffRate === ProbabilityType.MediumDropoff}
                onClick={ev => updateDropoffRate(ProbabilityType.MediumDropoff)}
                variant='secondary'
                className='w-100'>
          Medium
        </Button>
        <Button active={currentDropoffRate === ProbabilityType.Equiprobable}
                onClick={ev => updateDropoffRate(ProbabilityType.Equiprobable)}
                variant='secondary'
                className='w-100'>
          Equiprobable
        </Button>
      </ButtonGroup>
      */
     