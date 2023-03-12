import { configureStore } from '@reduxjs/toolkit';
import languageReducer from '../Languages/reducers/language.reducer';
import SimulatorReducer from '../Simulator/Simulator.reducer';

export const store = configureStore({
  reducer: {
    language: languageReducer,
    simulator: SimulatorReducer
  },
  middleware(getDefaultMiddleware) {
    // console.log(getDefaultMiddleware);
    return getDefaultMiddleware({
      serializableCheck: {
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.history'],
      },
    })
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

