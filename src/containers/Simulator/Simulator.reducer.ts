import { createSlice, createEntityAdapter, EntityState } from '@reduxjs/toolkit'
import { createSelector } from 'reselect'
import { RootState } from '../App/store';

export interface IGameEntity {
    id: number;
}

const gameEntityAdapter = createEntityAdapter<IGameEntity>({
  selectId: (entity) => entity.id
})

// Define a type for the slice state
interface SimulatorState {
  gameEntities: EntityState<IGameEntity>;
}

// Define the initial state using that type
const initialState: SimulatorState = {
  gameEntities: gameEntityAdapter.getInitialState()
}

export const simulatorSlice = createSlice({
  name: 'simulator',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    addGameEntity: (state, action) => {
      // console.log(action.payload);
      const gameEntities = gameEntityAdapter.upsertOne(
        {...state.gameEntities},
        { id: Math.max(...state.gameEntities.ids.map(x => state.gameEntities.entities[x]?.id ?? 0)) + 1 }
      );
      return {...state, gameEntities};
    }
  }
})

export const { addGameEntity } = simulatorSlice.actions;

export const getGameEntities = createSelector((state: RootState) => state.simulator, (state) => state.gameEntities);


export default simulatorSlice.reducer;
