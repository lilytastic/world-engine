import { configureStore } from '@reduxjs/toolkit';
import languageReducer from '../Languages/reducers/language.reducer';
import SimulatorReducer from '../Simulator/Simulator.reducer';
import characterReducers from '../Characters/character.reducers';

export const store = configureStore({
  reducer: {
    language: languageReducer,
    characters: characterReducers,
    simulator: SimulatorReducer
  },
  middleware(getDefaultMiddleware) {
    // console.log(getDefaultMiddleware);
    return getDefaultMiddleware({
      serializableCheck: {
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.history', 'simulator.display'],
      },
    })
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

