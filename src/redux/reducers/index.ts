import { combineReducers } from 'redux';
import authReducer from './authReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  // Add other reducers here as needed
  // booking: bookingReducer,
  // course: courseReducer,
  // user: userReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer; 