import { createSlice, createEntityAdapter, EntityState } from '@reduxjs/toolkit'
import { createSelector } from 'reselect'
import { RootState } from '../App/store';
import { DEFAULT_ENTITY, ICoords, Map } from './Simulator.helpers';

export interface IGameEntity {
  id: number;
  ch: string;
}

const gameEntityAdapter = createEntityAdapter<IGameEntity>({
  selectId: (entity) => entity.id
})

// Define a type for the slice state
interface SimulatorState {
  mapData: Map,
  gameEntities: EntityState<IGameEntity>;
  seenTiles: ICoords[];
  visibleTiles: ICoords[];
}

// Define the initial state using that type
const initialState: SimulatorState = {
  mapData: {},
  gameEntities: gameEntityAdapter.getInitialState(),
  seenTiles: [],
  visibleTiles: []
}

export const simulatorSlice = createSlice({
  name: 'simulator',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setMap: (state, action: {payload: Map}) => {
      return {...state, mapData: {...action.payload}};
    },
    addGameEntity: (state, action: {payload?: Partial<IGameEntity>}) => {
      // console.log(action.payload);
      const gameEntities = gameEntityAdapter.upsertOne(
        { ...state.gameEntities },
        {
          // First, take the default entity object
          ...DEFAULT_ENTITY,
          // Then set the id based on the highest value
          id: Math.max(...state.gameEntities.ids.map(x => state.gameEntities.entities[x]?.id ?? 0)) + 1,
          // Then use any values from the payload, if applicable.
          ...(action.payload || {})
        }
      );
      return {...state, gameEntities};
    }
  }
})

export const { addGameEntity, setMap } = simulatorSlice.actions;

export const getGameEntities = createSelector((state: RootState) => state.simulator, (state) => state.gameEntities);
export const getMapData = createSelector((state: RootState) => state.simulator, (state) => state.mapData);


export default simulatorSlice.reducer;
