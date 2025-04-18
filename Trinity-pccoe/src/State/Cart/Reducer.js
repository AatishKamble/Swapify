import {
    ADD_TO_CART_FAILURE,
    ADD_TO_CART_REQUEST,
    ADD_TO_CART_SUCCESS,
    GET_USER_CART_FAILURE,
    GET_USER_CART_REQUEST,
    GET_USER_CART_SUCCESS,
    REMOVE_CART_ITEM_FAILURE,
    REMOVE_CART_ITEM_REQUEST,
    REMOVE_CART_ITEM_SUCCESS,
    ADD_TO_WISHLIST_REQUEST,
    ADD_TO_WISHLIST_SUCCESS,
    ADD_TO_WISHLIST_FAILURE,
    REMOVE_WISHLIST_ITEM_REQUEST,
    REMOVE_WISHLIST_ITEM_SUCCESS,
    REMOVE_WISHLIST_ITEM_FAILURE,
    GET_USER_WISHLIST_REQUEST,
    GET_USER_WISHLIST_SUCCESS,
    GET_USER_WISHLIST_FAILURE,
  } from "./ActionType"
  
  const initialState = {
    loading: false,
    error: null,
    cart: null,
    wishlist: null,
    deleteCartItem: false,
  }
  
  export const cartReducer = (state = initialState, action) => {
    switch (action.type) {
      // Cart actions
      case GET_USER_CART_REQUEST:
      case ADD_TO_CART_REQUEST:
      case REMOVE_CART_ITEM_REQUEST:
        return { ...state, loading: true, error: null }
  
      case GET_USER_CART_SUCCESS:
        return {
          ...state,
          loading: false,
          cart: action.payload,
        }
  
      case ADD_TO_CART_SUCCESS:
        return {
          ...state,
          loading: false,
          cart: action.payload,
        }
  
      case REMOVE_CART_ITEM_SUCCESS:
        return {
          ...state,
          loading: false,
          deleteCartItem: true,
          cart: state.cart
            ? {
                ...state.cart,
                cartItems: state.cart.cartItems.filter((item) => item._id !== action.payload),
              }
            : null,
        }
  
      case GET_USER_CART_FAILURE:
      case ADD_TO_CART_FAILURE:
      case REMOVE_CART_ITEM_FAILURE:
        return { ...state, loading: false, error: action.payload }
  
      // Wishlist actions
      case GET_USER_WISHLIST_REQUEST:
      case ADD_TO_WISHLIST_REQUEST:
      case REMOVE_WISHLIST_ITEM_REQUEST:
        return { ...state, loading: true, error: null }
  
      case GET_USER_WISHLIST_SUCCESS:
        return {
          ...state,
          loading: false,
          wishlist: action.payload,
        }
  
      case ADD_TO_WISHLIST_SUCCESS:
        return {
          ...state,
          loading: false,
          wishlist: action.payload,
        }
  
      case REMOVE_WISHLIST_ITEM_SUCCESS:
        return {
          ...state,
          loading: false,
          wishlist: state.wishlist
            ? {
                ...state.wishlist,
                wishlistItems: state.wishlist.wishlistItems.filter((item) => item._id !== action.payload),
              }
            : null,
        }
  
      case GET_USER_WISHLIST_FAILURE:
      case ADD_TO_WISHLIST_FAILURE:
      case REMOVE_WISHLIST_ITEM_FAILURE:
        return { ...state, loading: false, error: action.payload }
  
      default:
        return state
    }
  }
  
  