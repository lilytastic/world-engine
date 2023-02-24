import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../App/store'
import { createSelector } from 'reselect'
import { DEFAULT_LANGUAGE, ILanguage } from '../models/sounds.model'

let storedLanguages = [];
try {
  const _x = localStorage.getItem('languages');
  if (_x) {
    storedLanguages = JSON.parse(_x);
  }
} catch {
  
}

const storedLanguage = localStorage.getItem('language');
let startingLanguage: ILanguage = DEFAULT_LANGUAGE;
try {
  if (storedLanguage) {
    startingLanguage = {...DEFAULT_LANGUAGE, ...JSON.parse(storedLanguage)};
  }
} catch {
  startingLanguage = DEFAULT_LANGUAGE;
}

// Define a type for the slice state
interface LanguageState {
  languages: ILanguage[];
}

// Define the initial state using that type
const initialState: LanguageState = {
  languages: [ ...(storedLanguages || []), startingLanguage ],
}

export const languageSlice = createSlice({
  name: 'language',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    // ...
  },
})

export const { } = languageSlice.actions

export const getLanguages = createSelector((state: RootState) => state.language, (state) => state.languages);


export default languageSlice.reducer
