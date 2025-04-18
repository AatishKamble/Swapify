import {
  ADD_TO_CART_REQUEST,
  ADD_TO_CART_SUCCESS,
  ADD_TO_CART_FAILURE,
  REMOVE_CART_ITEM_REQUEST,
  REMOVE_CART_ITEM_SUCCESS,
  REMOVE_CART_ITEM_FAILURE,
  GET_USER_CART_REQUEST,
  GET_USER_CART_SUCCESS,
  GET_USER_CART_FAILURE,
  ADD_TO_WISHLIST_REQUEST,
  ADD_TO_WISHLIST_SUCCESS,
  ADD_TO_WISHLIST_FAILURE,
  REMOVE_WISHLIST_ITEM_REQUEST,
  REMOVE_WISHLIST_ITEM_SUCCESS,
  REMOVE_WISHLIST_ITEM_FAILURE,
  GET_USER_WISHLIST_REQUEST,
  GET_USER_WISHLIST_SUCCESS,
  GET_USER_WISHLIST_FAILURE,
} from "./ActionType.js";
import { api } from "../../configApi/configApi.js";

// Cart Actions

export const addToCart = (reqData) => async (dispatch) => {
  try {
    dispatch({ type: ADD_TO_CART_REQUEST });
    const { data } = await api.post("/api/cart/add", reqData);
    dispatch({ type: ADD_TO_CART_SUCCESS, payload: data });
    return data;
  } catch (error) {
    console.error("Error adding to cart:", error.message);
    dispatch({ type: ADD_TO_CART_FAILURE, payload: error.message });
    throw error;
  }
};

export const getUserCart = () => async (dispatch) => {
  try {
    dispatch({ type: GET_USER_CART_REQUEST });
    const { data } = await api.get("/api/cart/");
    dispatch({ type: GET_USER_CART_SUCCESS, payload: data });
    return data;
  } catch (error) {
    console.error("Error fetching cart:", error.message);
    dispatch({ type: GET_USER_CART_FAILURE, payload: error.message });
    throw error;
  }
};

export const removeItemFromCart = (productId) => async (dispatch) => {
  try {
    dispatch({ type: REMOVE_CART_ITEM_REQUEST });
    const { data } = await api.delete(`/api/cart_items/delete/${productId}`);
    dispatch({ type: REMOVE_CART_ITEM_SUCCESS, payload: productId });
    return data;
  } catch (error) {
    console.error("Error removing cart item:", error.message);
    dispatch({ type: REMOVE_CART_ITEM_FAILURE, payload: error.message });
    throw error;
  }
};

// Wishlist Actions

export const addToWishlist = (reqData) => async (dispatch) => {
  try {
    dispatch({ type: ADD_TO_WISHLIST_REQUEST });
    const { data } = await api.post("/api/wishlist/add", reqData);
    dispatch({ type: ADD_TO_WISHLIST_SUCCESS, payload: data });
    return data;
  } catch (error) {
    console.error("Error adding to wishlist:", error.message);
    dispatch({ type: ADD_TO_WISHLIST_FAILURE, payload: error.message });
    throw error;
  }
};

export const getUserWishlist = () => async (dispatch) => {
  try {
    dispatch({ type: GET_USER_WISHLIST_REQUEST });
    const { data } = await api.get("/api/wishlist/");
    dispatch({ type: GET_USER_WISHLIST_SUCCESS, payload: data });
    return data;
  } catch (error) {
    console.error("Error fetching wishlist:", error.message);
    dispatch({ type: GET_USER_WISHLIST_FAILURE, payload: error.message });
    throw error;
  }
};

export const removeItemFromWishlist = (wishlistItemId) => async (dispatch) => {
  try {
    dispatch({ type: REMOVE_WISHLIST_ITEM_REQUEST })
    // Fix the API endpoint to match the route defined in your backend
    const { data } = await api.delete(`/api/wishlist/wishlist_items/delete/${wishlistItemId}`)
    dispatch({ type: REMOVE_WISHLIST_ITEM_SUCCESS, payload: wishlistItemId })
    return data
  } catch (error) {
    dispatch({ type: REMOVE_WISHLIST_ITEM_FAILURE, payload: error.message })
    throw error
  }
};