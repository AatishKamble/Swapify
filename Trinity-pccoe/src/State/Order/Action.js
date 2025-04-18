import { api } from "../../configApi/configApi.js"
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

// Create a new order
export const createOrder = (orderData) => async (dispatch) => {
  dispatch({ type: CREATE_ORDER_REQUEST })
  try {
    const { data } = await api.post("/api/user/orders/create", orderData)
    dispatch({ type: CREATE_ORDER_SUCCESS, payload: data })
    return data
  } catch (error) {
    dispatch({ type: CREATE_ORDER_FAILURE, payload: error.message })
    throw error
  }
}

// Get order by ID
export const getOrderById = (orderId) => async (dispatch) => {
  dispatch({ type: GET_ORDER_BY_ID_REQUEST })
  try {
    const { data } = await api.get(`/api/user/orders/${orderId}`)
    dispatch({ type: GET_ORDER_BY_ID_SUCCESS, payload: data })
    return data
  } catch (error) {
    dispatch({ type: GET_ORDER_BY_ID_FAILURE, payload: error.message })
    throw error
  }
}

// Get order history
export const getOrderHistory = () => async (dispatch) => {
  dispatch({ type: GET_ORDER_HISTORY_REQUEST })
  try {
    const { data } = await api.get("/api/user/orders")
    dispatch({ type: GET_ORDER_HISTORY_SUCCESS, payload: data })
    return data
  } catch (error) {
    dispatch({ type: GET_ORDER_HISTORY_FAILURE, payload: error.message })
    throw error
  }
}

// Cancel order
export const cancelOrder = (orderId) => async (dispatch) => {
  dispatch({ type: CANCEL_ORDER_REQUEST })
  try {
    const { data } = await api.put(`/api/user/orders/cancel/${orderId}`)
    dispatch({ type: CANCEL_ORDER_SUCCESS, payload: data })
    return data
  } catch (error) {
    dispatch({ type: CANCEL_ORDER_FAILURE, payload: error.message })
    throw error
  }
}

// Place order (confirm payment)
export const placeOrder = (orderId) => async (dispatch) => {
  dispatch({ type: CREATE_ORDER_REQUEST })
  try {
    const { data } = await api.post(`/api/user/orders/place/${orderId}`)
    dispatch({ type: CREATE_ORDER_SUCCESS, payload: data })
    return data
  } catch (error) {
    dispatch({ type: CREATE_ORDER_FAILURE, payload: error.message })
    throw error
  }
}

