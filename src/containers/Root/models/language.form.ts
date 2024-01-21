import { ProbabilityType } from "../../Languages/helpers/logic.helpers";
import { ILanguage } from "../../Languages/models/language.model";

export enum AutoFormField { TabGroup, Group, Control, Radio, Select, TileView }

export type AutoFormOption = {
    label: string;
    value: any;
}
export type AutoForm<T> = AutoFormItem<T>[];
export type AutoFormItem<T> = {
    type: AutoFormField;
    label?: string;
    key?: string;
    as?: string;
    options?: AutoFormOption[];
    children?: AutoFormItem<T>[];
}

export const LanguageForm: AutoForm<ILanguage> = [
    {
        type: AutoFormField.TabGroup,
        children: [
            {
                label: 'Phonology',
                key: 'phonology', // In this case, all children will attempt to modify 'phonology.X' on the base object.
                type: AutoFormField.Group,
                children: [
                    {
                        type: AutoFormField.Control,
                        label: 'Phoneme Classes',
                        key: 'phonemeClasses',
                        as: 'textarea'
                    },
                    {
                        type: AutoFormField.Control,
                        label: 'Word Patterns',
                        key: 'wordPatterns',
                        as: 'textarea'
                    },
                    {
                        type: AutoFormField.Radio,
                        label: 'Probability Dropoff',
                        key: 'dropoffRate',
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
