import {
    CREATE_ADDRESS_REQUEST,
    CREATE_ADDRESS_SUCCESS,
    CREATE_ADDRESS_FAILURE,
    GET_ADDRESS_REQUEST,
    GET_ADDRESS_SUCCESS,
    GET_ADDRESS_FAILURE,
    UPDATE_ADDRESS_REQUEST,
    UPDATE_ADDRESS_SUCCESS,
    UPDATE_ADDRESS_FAILURE,
    DELETE_ADDRESS_REQUEST,
    DELETE_ADDRESS_SUCCESS,
    DELETE_ADDRESS_FAILURE,
    SET_DEFAULT_ADDRESS_REQUEST,
    SET_DEFAULT_ADDRESS_SUCCESS,
    SET_DEFAULT_ADDRESS_FAILURE,
} from "./ActionType.js"
  
const initialState = {
    addresses: [],
    loading: false,
    error: null,
    currentAddress: null,
}
  
export const addressReducer = (state = initialState, action) => {
    switch (action.type) {
        case CREATE_ADDRESS_REQUEST:
        case GET_ADDRESS_REQUEST:
        case UPDATE_ADDRESS_REQUEST:
        case DELETE_ADDRESS_REQUEST:
        case SET_DEFAULT_ADDRESS_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            }
    
        case CREATE_ADDRESS_SUCCESS:
            return {
                ...state,
                loading: false,
                addresses: [...state.addresses, action.payload],
                error: null,
            }
    
        case GET_ADDRESS_SUCCESS:
            return {
                ...state,
                loading: false,
                addresses: action.payload,
                error: null,
            }
    
        case UPDATE_ADDRESS_SUCCESS:
            return {
                ...state,
                loading: false,
                addresses: state.addresses.map((address) => (address._id === action.payload._id ? action.payload : address)),
                error: null,
            }
    
        case DELETE_ADDRESS_SUCCESS:
            return {
                ...state,
                loading: false,
                addresses: state.addresses.filter((address) => address._id !== action.payload),
                error: null,
            }
    
        case SET_DEFAULT_ADDRESS_SUCCESS:
            return {
                ...state,
                loading: false,
                addresses: state.addresses.map((address) => ({
                    ...address,
                    isDefault: address._id === action.payload._id,
                })),
                error: null,
            }
    
        case CREATE_ADDRESS_FAILURE:
        case GET_ADDRESS_FAILURE:
        case UPDATE_ADDRESS_FAILURE:
        case DELETE_ADDRESS_FAILURE:
        case SET_DEFAULT_ADDRESS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            }
    
        default:
            return state
    }
}