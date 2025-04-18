import axios from "axios"
import { API_BASE_URL } from "../../configApi/configApi"
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

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("jwt")
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
}

// Create a new address
export const createAddress = (addressData) => async (dispatch) => {
  dispatch({ type: CREATE_ADDRESS_REQUEST })
  try {
    const { data } = await axios.post(`${API_BASE_URL}/api/address/create`, addressData, getAuthHeaders())
    dispatch({ type: CREATE_ADDRESS_SUCCESS, payload: data })
    return data
  } catch (error) {
    dispatch({ type: CREATE_ADDRESS_FAILURE, payload: error.message })
    throw error
  }
}

// Get all addresses for the current user
export const getAddresses = () => async (dispatch) => {
  dispatch({ type: GET_ADDRESS_REQUEST })
  try {
    const { data } = await axios.get(`${API_BASE_URL}/api/address`, getAuthHeaders())
    dispatch({ type: GET_ADDRESS_SUCCESS, payload: data })
    return data
  } catch (error) {
    dispatch({ type: GET_ADDRESS_FAILURE, payload: error.message })
    throw error
  }
}

// Update an existing address
export const updateAddress = (addressId, addressData) => async (dispatch) => {
  dispatch({ type: UPDATE_ADDRESS_REQUEST })
  try {
    const { data } = await axios.put(`${API_BASE_URL}/api/address/${addressId}`, addressData, getAuthHeaders())
    dispatch({ type: UPDATE_ADDRESS_SUCCESS, payload: data })
    return data
  } catch (error) {
    dispatch({ type: UPDATE_ADDRESS_FAILURE, payload: error.message })
    throw error
  }
}

// Delete an address
export const deleteAddress = (addressId) => async (dispatch) => {
  dispatch({ type: DELETE_ADDRESS_REQUEST })
  try {
    await axios.delete(`${API_BASE_URL}/api/address/${addressId}`, getAuthHeaders())
    dispatch({ type: DELETE_ADDRESS_SUCCESS, payload: addressId })
    return addressId
  } catch (error) {
    dispatch({ type: DELETE_ADDRESS_FAILURE, payload: error.message })
    throw error
  }
}

// Set an address as default
export const setDefaultAddress = (addressId) => async (dispatch) => {
  dispatch({ type: SET_DEFAULT_ADDRESS_REQUEST })
  try {
    const { data } = await axios.put(
      `${API_BASE_URL}/api/address/${addressId}/default`,
      {}, // Empty body
      getAuthHeaders(),
    )
    dispatch({ type: SET_DEFAULT_ADDRESS_SUCCESS, payload: data })
    return data
  } catch (error) {
    dispatch({ type: SET_DEFAULT_ADDRESS_FAILURE, payload: error.message })
    throw error
  }
}
