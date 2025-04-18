import {
    CREATE_ORDER_REQUEST,
    CREATE_ORDER_SUCCESS,
    CREATE_ORDER_FAILURE,
    GET_ORDER_BY_ID_REQUEST,
    GET_ORDER_BY_ID_SUCCESS,
    GET_ORDER_BY_ID_FAILURE,
    GET_ORDER_HISTORY_REQUEST,
    GET_ORDER_HISTORY_SUCCESS,
    GET_ORDER_HISTORY_FAILURE,
    CANCEL_ORDER_REQUEST,
    CANCEL_ORDER_SUCCESS,
    CANCEL_ORDER_FAILURE,
} from "./ActionType.js"
  
const initialState = {
    orders: [],
    order: null,
    loading: false,
    error: null,
    orderPlaced: false,
}
  
export const orderReducer = (state = initialState, action) => {
    switch (action.type) {
        case CREATE_ORDER_REQUEST:
        case GET_ORDER_BY_ID_REQUEST:
        case GET_ORDER_HISTORY_REQUEST:
        case CANCEL_ORDER_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            }
    
        case CREATE_ORDER_SUCCESS:
            return {
                ...state,
                loading: false,
                order: action.payload,
                orderPlaced: true,
            }
    
        case GET_ORDER_BY_ID_SUCCESS:
            return {
                ...state,
                loading: false,
                order: action.payload,
            }
    
        case GET_ORDER_HISTORY_SUCCESS:
            return {
                ...state,
                loading: false,
                orders: action.payload,
            }
    
        case CANCEL_ORDER_SUCCESS:
            return {
                ...state,
                loading: false,
                orders: state.orders.map((order) => (order._id === action.payload._id ? action.payload : order)),
            }
    
        case CREATE_ORDER_FAILURE:
        case GET_ORDER_BY_ID_FAILURE:
        case GET_ORDER_HISTORY_FAILURE:
        case CANCEL_ORDER_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            }
    
        default:
            return state
    }
}  