import { ElementType } from "react";
import { ProbabilityType } from "../../Languages/helpers/logic.helpers";
import { ILanguage } from "../../Languages/models/language.model";
import { OverlayChildren } from "react-bootstrap/esm/Overlay";
import { Popover } from "react-bootstrap";

export enum AutoFormField { TabGroup, Tab, Group, Control, Radio, Select, TileView, CheckGroup, StringDictionary }

export type AutoFormOption = {
  label: string;
  key?: string;
  value?: any;
}
export type AutoForm<T> = AutoFormItem<T>[];
export type AutoFormItem<T> = {
  type: AutoFormField;
  label?: string;
  key?: string;
  id?: string;
  placeholder?: string;
  as?: ElementType;
  options?: AutoFormOption[];
  children?: AutoFormItem<T>[];
  popover?: OverlayChildren;
  footerText?: string;
}

export const LanguageForm: AutoForm<ILanguage> = [
  {
    type: AutoFormField.TabGroup,
    children: [
      {
        type: AutoFormField.Tab,
        label: 'Phonology',
        key: 'phonology', // In this case, all children will attempt to modify 'phonology.X' on the base object.
        children: [
          {
            type: AutoFormField.Group,
            children: [
              {
                type: AutoFormField.Control,
                label: 'Phoneme Classes',
                key: 'phonemeClasses',
                as: 'textarea',
                footerText: `most frequent <-> least frequent`,
                popover: (<Popover id="popover-basic">
                  <Popover.Body>
                    <ul className='list'>
                      <li>Assign phonemes to classes (uppercase letters), which act as placeholders for Word Patterns</li>
                      <li>The uppercase letters don't inherently mean anything, and any phoneme can be assigned to any class</li>
                      <li>Classes contain sequences of phonemes (A = ion lar mel) and sequences of other classes (S = CV VC)</li>
                      <li>If you need more than 26 classes, the following Greek letters can be used: ΓΔΘΛΞΠΣΦΨΩ</li>
                    </ul>
                  </Popover.Body>
                </Popover>)
              },
              {
                type: AutoFormField.Control,
                label: 'Word Patterns',
                key: 'wordPatterns',
                as: 'textarea',
                popover: (<Popover id="popover-basic">
                  <Popover.Body>
                    <ul className='list'>
                      <li>Word patterns are made of classes or actual phonemes, eg: zVC means the word will always start with z, then a random choice of V and C.</li>
                      <li>Use brackets for optional patterns: CV(zV) means the zV pattern occurs 20% of the time. Manually change the probability by writing it after the brackets: CV(zV)50%.</li>
                      <li>Patterns for particular parts-of-speech can be added after the default patterns, eg: part-of-speech = ...</li>
                    </ul>
                  </Popover.Body>
                </Popover>)
              },
              {
                type: AutoFormField.Radio,
                label: 'Probability Dropoff',
                key: 'dropoffRate',
                popover: (
                  <Popover id="popover-basic">
                    <Popover.Body>
                      <ul className='list'>
                        <li>Phonemes are ranked by frequency from left (most frequent) to right (least frequent).</li>
                        <li><b>Fast</b> rate makes frequent phonemes even more frequent, <b>Medium</b> creates a more even spread, and <b>Equiprobable</b> creates a perfectly even spread.</li>
                        <li>When using Equiprobable, phonemes can be custom weighted by writing *multiplier. For example, p*10 makes p ten times more common than a phoneme without a multiplier. To make it less likely, multiply by a decimal: p*0.4.</li>
                      </ul>
                    </Popover.Body>
                  </Popover>
                ),
                options: [
                  {
                    label: 'Fast dropoff',
                    value: ProbabilityType.FastDropoff
                  },
                  {
                    label: 'Medium dropoff',
                    value: ProbabilityType.MediumDropoff
                  },
                  {
                    label: 'Equiprobable',
                    value: ProbabilityType.Equiprobable
                  }
                ]
              }
            ]
          },
          {
            type: AutoFormField.Group,
            children: [
              {
                type: AutoFormField.Control,
                label: 'Forbidden Combinations',
                key: 'forbiddenCombinations',
                placeholder: '#ŋ dt',
                as: 'textarea'
              },
              {
                type: AutoFormField.CheckGroup,
                label: 'Probability Dropoff',
                options: [
                  {
                    label: 'Ban two of the same vowels in a row',
                    key: 'banSameVowels'
                  },
                  {
                    label: 'Ban two of the same consonants in a row',
                    key: 'banSameConsonants'
                  }
                ]
              }
            ]
          },
          {
            type: AutoFormField.Group,
            children: [
              {
                type: AutoFormField.Control,
                label: 'Sound Changes',
                key: 'soundChanges',
                placeholder: 'ʒ > d / _#',
                as: 'textarea'
              },
            ]
          }
        ]
      },
      {
        type: AutoFormField.Tab,
        label: 'Vocabulary',
        id: 'vocabulary',
        children: [
          {
            type: AutoFormField.Group,
            children: [
              {
                type: AutoFormField.Control,
                key: 'name',
                label: 'Language Name'
              }
            ]
          },
          {
            type: AutoFormField.Group,
            label: 'Dictionary',
            children: [
              {
                type: AutoFormField.StringDictionary,
                key: 'dictionary'
              }
            ]
          }
        ]
      }
    ]
  }
]

export const CultureForm = [
  {
    type: AutoFormField.TabGroup,
    children: [
      {
        label: 'Memes',
        type: AutoFormField.Group,
        children: [
          {
            type: AutoFormField.TileView, // Represents the data as tiles, and allows user to toggle them on or off.
            templateOptions: {
              behaviour: 'toggle',
              min: 0
            },
            key: 'memes'
          },
          {
            type: AutoFormField.Group,
            label: 'Add New Meme',
            children: []
          }
        ]
      }
    ]
  }
]
