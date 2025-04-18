import { applyMiddleware, combineReducers, legacy_createStore } from "redux";
import { thunk } from "redux-thunk";
import { authReducer } from "./Auth/Reducer";
import {productReducer} from "./Product/Reducer";
import { cartReducer } from "./Cart/Reducer";
import { addressReducer } from "./Address/Reducer.js"
import { orderReducer } from "./Order/Reducer.js"
import { reviewReducer } from "./Review/Reducer.js"

const rootReducer=combineReducers({
    auth:authReducer,
    product:productReducer,
    cart:cartReducer,
    address:addressReducer,
    order:orderReducer,
    review:reviewReducer
});

export const store=legacy_createStore(rootReducer,applyMiddleware(thunk));