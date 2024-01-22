import { ElementType } from "react";
import { OverlayChildren } from "react-bootstrap/esm/Overlay";

export enum AutoFormField { TabGroup, Button, Tab, Group, Control, Radio, Select, TileView, CheckGroup, StringDictionary, WordDictionary }

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
