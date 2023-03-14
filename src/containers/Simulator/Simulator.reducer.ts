import { createSlice, createEntityAdapter, EntityState } from '@reduxjs/toolkit'
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
  currentMap: string,
  persistentMaps: EntityState<Map>;
  tempMaps: EntityState<Map>;
  persistentEntities: EntityState<PersistentEntity>;
  tempEntities: EntityState<TempEntity>;
  currentMode: GameMode;
  playingAs: number;
  seenTiles: Vector2[];
  visibleTiles: Vector2[];
}

// Define the initial state using that type
const initialState: SimulatorState = {
  display: null,
  currentMap: '',
  playingAs: -1,
  currentMode: GameMode.Start,
  persistentMaps: mapAdapter.getInitialState(),
  tempMaps: mapAdapter.getInitialState(),
  persistentEntities: persistentEntityAdapter.getInitialState(),
  tempEntities: tempEntityAdapter.getInitialState(),
  seenTiles: [],
  visibleTiles: []
}

export const simulatorSlice = createSlice({
  name: 'simulator',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setMap: (state, action: {payload: string}) => {
      return {...state, currentMap: action.payload};
    },
    addPersistentMap: (state, action: {payload: Map}) => {
      const map = {...action.payload};
      map.id = Math.max(0, ...state.persistentMaps.ids.map(x => +x)) + 1;
      return {...state, persistentMaps: mapAdapter.upsertOne({...state.persistentMaps}, map)};
    },
    addTemporaryMap: (state, action: {payload: Map}) => {
      const map = {...action.payload};
      map.id = Math.max(0, ...state.tempMaps.ids.map(x => +x)) + 1;
      console.log(map);
      return {...state, currentMap: map.id.toString(), tempMaps: mapAdapter.upsertOne({...state.tempMaps}, map)};
    },
    setDisplay: (state, action: {payload: HTMLElement}) => {
      return {...state, display: action.payload};
    },
    setSeenTiles: (state, action: {payload: Vector2[]}) => {
      return {...state, seenTiles: action.payload};
    },
    setVisibleTiles: (state, action: {payload: Vector2[]}) => {
      return {...state, visibleTiles: action.payload};
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

export const { addGameEntity, setDisplay, setMap, setSeenTiles, setVisibleTiles, addTemporaryMap, addPersistentMap } = simulatorSlice.actions;

export const getPersistentEntities = createSelector((state: RootState) => state.simulator, (state) => state.persistentEntities);
export const getPlayer = createSelector((state: RootState) => state.simulator, (state) => state.persistentEntities.entities[state.playingAs]);
export const getCurrentMap = createSelector((state: RootState) => state.simulator, (state) => state.persistentMaps.entities[state.currentMap] || state.tempMaps.entities[state.currentMap]);
export const getMapData = createSelector(getCurrentMap, (map) => map?.mapData);
export const getSeenTiles = createSelector((state: RootState) => state.simulator, (state) => state.seenTiles);
export const getVisibleTiles = createSelector((state: RootState) => state.simulator, (state) => state.visibleTiles);
export const getGameMode = createSelector((state: RootState) => state.simulator, (state) => state.currentMode);
export const getCurrentDisplay = createSelector((state: RootState) => state.simulator, (state) => state.display);


export default simulatorSlice.reducer;
