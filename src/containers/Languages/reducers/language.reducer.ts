import { createSlice, createEntityAdapter, EntityState } from '@reduxjs/toolkit'
import type { RootState } from '../../Root/store'
import { createSelector } from 'reselect'
import { DEFAULT_LANGUAGE, ILanguage } from '../models/language.model';
import { NavigateFunction, Navigation } from 'react-router';

const languageAdapter = createEntityAdapter<ILanguage>({
  // Assume IDs are stored in a field other than `book.id`
  selectId: (book) => book.id,
  // Keep the "all IDs" array sorted based on book titles
  sortComparer: (a, b) => a.name.localeCompare(b.name),
})

// Define a type for the slice state
interface LanguageState {
  languages: EntityState<ILanguage>;
  scratch: ILanguage | null;
}

let storedLanguages = null;
try {
  const _x = localStorage.getItem('languages');
  if (_x) {
    storedLanguages = JSON.parse(_x) as EntityState<ILanguage>;
    // const langs = storedLanguages;
    // storedLanguages = languageAdapter.removeMany(langs, langs.ids.filter(id => langs.entities[id]?.name === ''));
  }
} catch (err) {
  console.error(err);
}
// Define the initial state using that type
const initialState: LanguageState = {
  languages: storedLanguages || languageAdapter.getInitialState(),
  scratch: DEFAULT_LANGUAGE
}

export const languageSlice = createSlice({
  name: 'language',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    addNewLanguage: (state, action) => {
      const template = action.payload.template || DEFAULT_LANGUAGE;
      const spread = action.payload.spread || {};
      const newLanguage = { ...template, ...spread, id: Math.max(0, Math.max(...state.languages.ids.map(x => +x)) + 1) };
      console.log(newLanguage);
      return {...state};
      const languages = languageAdapter.upsertOne({...state.languages}, newLanguage);
      localStorage.setItem('languages', JSON.stringify(languages));
      if (action.payload.history) {
        const history = action.payload.history as NavigateFunction;
        history('/languages/' + newLanguage.id);
      }
      return {...state, languages: {...languages}};
    },
    updateScratch: (state, action) => {
      // console.log(action.payload);
      const lang: ILanguage = action.payload;
      return {...state, scratch: lang};
    },
    clearScratch: (state, action) => {
      // console.log(action.payload);
      const lang: ILanguage = action.payload;
      return {...state, scratch: DEFAULT_LANGUAGE};
    },
    updateLanguage: (state, action) => {
      // console.log(action.payload);
      const lang: ILanguage = action.payload;
      const languages = languageAdapter.updateOne({...state.languages}, { id: lang.id, changes: lang });
      localStorage.setItem('languages', JSON.stringify(languages));
      return {...state, languages};
    },
    deleteLanguage: (state, action) => {
      const languages = languageAdapter.removeOne({...state.languages}, action.payload.id);
      localStorage.setItem('languages', JSON.stringify(languages));
      return {...state, languages};
    }
  }
})

export const { addNewLanguage, updateLanguage, deleteLanguage, updateScratch, clearScratch } = languageSlice.actions;

const getFeatureState = (state: RootState) => state.language;
export const getLanguages = createSelector(getFeatureState, (state) => state.languages);
export const getScratch = createSelector(getFeatureState, (state) => state.scratch)


export default languageSlice.reducer;
