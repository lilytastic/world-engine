import { ElementType } from "react";
import { ProbabilityType } from "../../Languages/helpers/logic.helpers";
import { ILanguage } from "../../Languages/models/language.model";
import { OverlayChildren } from "react-bootstrap/esm/Overlay";
import { Popover } from "react-bootstrap";

export enum AutoFormField { TabGroup, Tab, Group, Control, Radio, Select, TileView, CheckGroup, StringDictionary, WordDictionary }

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
  templateOptions?: any;
  placeholder?: string;
  as?: ElementType;
  options?: AutoFormOption[];
  children?: AutoFormItem<T>[];
  popover?: OverlayChildren;
  footerText?: string;
}

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
