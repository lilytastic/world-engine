import { createSlice, createEntityAdapter, EntityState } from '@reduxjs/toolkit'
import { createSelector } from 'reselect'
import { RootState } from '../App/store';
import { DEFAULT_ENTITY, Vector2, Map } from './Simulator.helpers';

export interface IGameEntity {
  id: number;
  ch: string;
  position: Vector2 & { map: string };
}

const gameEntityAdapter = createEntityAdapter<IGameEntity>({
  selectId: (entity) => entity.id
});
const mapAdapter = createEntityAdapter<IMap>({
  selectId: (entity) => entity.id
});

export interface IMap {
  id: string;
}

export enum GameMode {
  Start = 'start',
  Map = 'map' // actual play
}

// Define a type for the slice state
interface SimulatorState {
  mapData: Map,
  gameEntities: EntityState<IGameEntity>;
  maps: EntityState<IMap>;
  currentMode: GameMode
  playingAs: number;
  seenTiles: Vector2[];
  visibleTiles: Vector2[];
}

// Define the initial state using that type
const initialState: SimulatorState = {
  mapData: {},
  playingAs: -1,
  currentMode: GameMode.Start,
  gameEntities: gameEntityAdapter.getInitialState(),
  maps: mapAdapter.getInitialState(),
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
    setSeenTiles: (state, action: {payload: Vector2[]}) => {
      return {...state, seenTiles: action.payload};
    },
    setVisibleTiles: (state, action: {payload: Vector2[]}) => {
      return {...state, visibleTiles: action.payload};
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
});

export const { addGameEntity, setMap, setSeenTiles, setVisibleTiles } = simulatorSlice.actions;

export const getGameEntities = createSelector((state: RootState) => state.simulator, (state) => state.gameEntities);
export const getPlayer = createSelector((state: RootState) => state.simulator, (state) => state.gameEntities.entities[state.playingAs]);
export const getMapData = createSelector((state: RootState) => state.simulator, (state) => state.mapData);
export const getSeenTiles = createSelector((state: RootState) => state.simulator, (state) => state.seenTiles);
export const getVisibleTiles = createSelector((state: RootState) => state.simulator, (state) => state.visibleTiles);
export const getGameMode = createSelector((state: RootState) => state.simulator, (state) => state.currentMode);


export default simulatorSlice.reducer;
