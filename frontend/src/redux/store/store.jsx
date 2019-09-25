/**
 * Redux Store
 *
 * Creates a Redux store for the application and passes the root reducer
 * to the store. Also applies the thunk middleware so that actions can
 * be dispatched asynchronously.
 */

// Dependencies
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

// Reducers
import rootReducer from "../reducers";

// Redux Persistence Config.
const persistConfig = {
    key: "FA-Demo",
    storage
}

// Reducer for persisted config.
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the Redux store.
const store = createStore(persistedReducer, applyMiddleware(thunk));
const persistor = persistStore(store);

// Export the Redux store.
export {
    store,
    persistor
};