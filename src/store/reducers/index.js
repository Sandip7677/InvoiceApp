import { combineReducers } from 'redux';
// import invoicesReducer from './slices/invoicesSlice';
import invoicesSlice from '../slices/invoicesSlice';

const rootReducer = combineReducers({
  invoices: invoicesSlice,
});

export default rootReducer;