import { combineReducers } from "@reduxjs/toolkit";
import appReducer from "./appReducer";

const reducers = combineReducers({
  appReducer: appReducer
  
});

export default reducers;