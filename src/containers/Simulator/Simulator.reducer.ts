import { createSlice, createEntityAdapter, EntityState, Update } from '@reduxjs/toolkit'
import { createSelector } from 'reselect'
import { RootState } from '../App/store';
import { DEFAULT_ENTITY, Vector2, MapData } from './Simulator.helpers';

export interface IGameEntity {
  id: number;
  ch: string;
  position: Vector2 & { map: string };
}

export type PersistentEntity = IGameEntity;
export type TempEntity = IGameEntity;

export const persistentEntityAdapter = createEntityAdapter<PersistentEntity>({
  selectId: (entity) => entity.id
});
export const tempEntityAdapter = createEntityAdapter<TempEntity>({
  selectId: (entity) => 'temp-'+entity.id
});
const mapAdapter = createEntityAdapter<Map>({
  selectId: (entity) => entity.id
});

export type Map = {
  id: number;
  mapData: MapData;
  seenTiles: Vector2[];
  visibleTiles: Vector2[];
  entrance: Vector2;
  entities: EntityState<IGameEntity>;
}

export enum GameMode {
  Start = 'start',
  Map = 'map',
  Play = 'play' // actual play
}

// Define a type for the slice state
interface SimulatorState {
  display: HTMLElement | null,
  currentMap: number,
  maps: EntityState<Map>;
  persistentEntities: EntityState<PersistentEntity>;
  tempEntities: EntityState<TempEntity>;
  currentMode: GameMode;
  playingAs: number;
}

// Define the initial state using that type
const initialState: SimulatorState = {
  display: null,
  currentMap: 0,
  playingAs: -1,
  currentMode: GameMode.Start,
  maps: mapAdapter.getInitialState(),
  persistentEntities: persistentEntityAdapter.getInitialState(),
  tempEntities: tempEntityAdapter.getInitialState()
}

export const simulatorSlice = createSlice({
  name: 'simulator',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setMap: (state, action: {payload: number}) => {
      return {...state, currentMap: action.payload};
    },
    addMap: (state, action: {payload: Map}) => {
      const map = {...action.payload};
      map.id = Math.max(0, ...state.maps.ids.map(x => +x)) + 1;
      console.log(map);
      return {...state, currentMap: map.id, maps: mapAdapter.upsertOne({...state.maps}, map)};
    },
    setDisplay: (state, action: {payload: HTMLElement}) => {
      return {...state, display: action.payload};
    },
    setSeenTiles: (state, action: {payload: Vector2[]}) => {
      // @ts-ignore;
      return {...state, maps: mapAdapter.updateOne({...state.maps}, {id: state.currentMap, changes: { seenTiles: action.payload }}) };
    },
    setVisibleTiles: (state, action: {payload: Vector2[]}) => {
      return {...state, maps: mapAdapter.updateOne({...state.maps}, {id: state.currentMap, changes: { visibleTiles: action.payload }}) };
    },
    updateMap: (state, action: {payload: Update<Map>}) => {
      return {...state, maps: mapAdapter.updateOne({...state.maps}, action.payload) };
    },
    addGameEntity: (state, action: {payload?: Partial<IGameEntity>}) => {
      // console.log(action.payload);
      const gameEntities = persistentEntityAdapter.upsertOne(
        { ...state.persistentEntities },
        {
          // First, take the default entity object
          ...DEFAULT_ENTITY,
          // Then set the id based on the highest value
          id: Math.max(...state.persistentEntities.ids.map(x => state.persistentEntities.entities[x]?.id ?? 0)) + 1,
          // Then use any values from the payload, if applicable.
          ...(action.payload || {})
        }
      );
      return {...state, gameEntities};
    }
  }
});

export const { addGameEntity, setDisplay, setMap, setSeenTiles, setVisibleTiles, addMap } = simulatorSlice.actions;

export const getPersistentEntities = createSelector((state: RootState) => state.simulator, (state) => state.persistentEntities);
export const getPlayer = createSelector((state: RootState) => state.simulator, (state) => state.persistentEntities.entities[state.playingAs]);
export const getCurrentMap = createSelector((state: RootState) => state.simulator, (state) => state.maps.entities[state.currentMap]);
export const getMapData = createSelector(getCurrentMap, (map) => map?.mapData);
export const getSeenTiles = createSelector(getCurrentMap, (map) => map?.seenTiles);
export const getVisibleTiles = createSelector(getCurrentMap, (map) => map?.visibleTiles)
export const getGameMode = createSelector((state: RootState) => state.simulator, (state) => state.currentMode);
export const getCurrentDisplay = createSelector((state: RootState) => state.simulator, (state) => state.display);


export default simulatorSlice.reducer;
