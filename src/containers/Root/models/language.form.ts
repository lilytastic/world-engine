import { ProbabilityType } from "../../Languages/helpers/logic.helpers";

export enum Form { TabGroup, Group, Control, Radio, Select }

export const LanguageForm = [
    {
        type: Form.TabGroup,
        children: [
            {
                label: 'Phonology',
                type: Form.Group,
                children: [
                    {
                        type: Form.Control,
                        label: 'Phoneme Classes',
                        key: 'phonemeClasses'
                    },
                    {
                        type: Form.Control,
                        label: 'Word Patterns',
                        key: 'wordPatterns'
                    },
                    {
                        type: Form.Radio,
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
