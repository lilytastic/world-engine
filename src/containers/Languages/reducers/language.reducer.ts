import { createSlice, createEntityAdapter, EntityState } from '@reduxjs/toolkit'
import type { RootState } from '../../App/store'
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
  languages: storedLanguages || languageAdapter.getInitialState()
}

export const languageSlice = createSlice({
  name: 'language',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    addNewLanguage: (state, action) => {
      const newLanguage = { ...DEFAULT_LANGUAGE, ...(action.payload.language || {}), id: Math.max(0, Math.max(...state.languages.ids.map(x => +x)) + 1) };
      const languages = languageAdapter.upsertOne({...state.languages}, newLanguage);
      localStorage.setItem('languages', JSON.stringify(languages));
      if (action.payload.history) {
        const history = action.payload.history as NavigateFunction;
        history('/languages/' + newLanguage.id);
      }
      return {...state, languages: {...languages}};
    },
    updateLanguage: (state, action) => {
      // console.log(action.payload);
      const lang: ILanguage = action.payload;
      const languages = languageAdapter.updateOne({...state.languages}, { id: lang.id, changes: lang });
      localStorage.setItem('languages', JSON.stringify(languages));
      return {...state, languages};
    }
  }
})

export const { addNewLanguage, updateLanguage } = languageSlice.actions;

export const getLanguages = createSelector((state: RootState) => state.language, (state) => state.languages);


export default languageSlice.reducer;
