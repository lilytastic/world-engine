import { createSlice, createEntityAdapter, EntityState } from '@reduxjs/toolkit'
import type { RootState } from '../Root/store'
import { createSelector } from 'reselect'
import { DEFAULT_CHARACTER, ICharacter } from './models/character.model';
import { NavigateFunction, Navigation } from 'react-router';

const characterAdapter = createEntityAdapter<ICharacter>({
  // Assume IDs are stored in a field other than `book.id`
  selectId: (thing) => thing.id,
  // Keep the "all IDs" array sorted based on book titles
  sortComparer: (a, b) => a.name.localeCompare(b.name),
})

// Define a type for the slice state
interface CharacterState {
  characters: EntityState<ICharacter>;
}

let storedCharacters = null;
try {
  const _x = localStorage.getItem('characters');
  if (_x) {
    storedCharacters = JSON.parse(_x) as EntityState<ICharacter>;
    // const langs = storedCharacters;
    // storedCharacters = characterAdapter.removeMany(langs, langs.ids.filter(id => langs.entities[id]?.name === ''));
  }
} catch (err) {
  console.error(err);
}
// Define the initial state using that type
const initialState: CharacterState = {
  characters: storedCharacters || characterAdapter.getInitialState()
}

export const characterSlice = createSlice({
  name: 'character',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    addNewCharacter: (state, action) => {
      const newCharacter = { ...DEFAULT_CHARACTER, ...(action.payload.character || {}), id: Math.max(0, Math.max(...state.characters.ids.map(x => +x)) + 1) };
      const characters = characterAdapter.upsertOne({...state.characters}, newCharacter);
      localStorage.setItem('characters', JSON.stringify(characters));
      if (action.payload.history) {
        const history = action.payload.history as NavigateFunction;
        history('/characters/' + newCharacter.id);
      }
      return {...state, characters: {...characters}};
    },
    updateCharacter: (state, action) => {
      // console.log(action.payload);
      const lang: ICharacter = action.payload;
      const characters = characterAdapter.updateOne({...state.characters}, { id: lang.id, changes: lang });
      localStorage.setItem('characters', JSON.stringify(characters));
      return {...state, characters};
    },
    deleteCharacter: (state, action) => {
      const characters = characterAdapter.removeOne({...state.characters}, action.payload.id);
      localStorage.setItem('characters', JSON.stringify(characters));
      return {...state, characters};
    }
  }
})

export const { addNewCharacter, updateCharacter, deleteCharacter } = characterSlice.actions;

export const getCharacters = createSelector((state: RootState) => state.characters, (state) => state.characters);


export default characterSlice.reducer;
