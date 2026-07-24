import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducers/index";

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for serialization checks
        ignoredActions: ["user/setSession"],
        // Ignore these field paths in state
        ignoredActionPaths: ["payload.timestamp"],
        ignoredPaths: ["user.session.expiresAt"],
      },
    }),
  devTools: process.env.NODE_ENV !== "production",
});

export default store;
