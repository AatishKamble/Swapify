import { api } from "../../configApi/configApi.js"
import {
  CREATE_REVIEW_REQUEST,
  CREATE_REVIEW_SUCCESS,
  CREATE_REVIEW_FAILURE,
  GET_PRODUCT_REVIEWS_REQUEST,
  GET_PRODUCT_REVIEWS_SUCCESS,
  GET_PRODUCT_REVIEWS_FAILURE,
  GET_USER_REVIEWS_REQUEST,
  GET_USER_REVIEWS_SUCCESS,
  GET_USER_REVIEWS_FAILURE,
  UPDATE_REVIEW_REQUEST,
  UPDATE_REVIEW_SUCCESS,
  UPDATE_REVIEW_FAILURE,
  DELETE_REVIEW_REQUEST,
  DELETE_REVIEW_SUCCESS,
  DELETE_REVIEW_FAILURE,
  RESET_REVIEW_STATE,
} from "./ActionType.js"

// Create a new review
export const createReview = (reviewData) => async (dispatch) => {
  dispatch({ type: CREATE_REVIEW_REQUEST })
  try {
    const { data } = await api.post("/api/reviews/create", reviewData)
    dispatch({ type: CREATE_REVIEW_SUCCESS, payload: data })
    return { success: true, data }
  } catch (error) {
    dispatch({ type: CREATE_REVIEW_FAILURE, payload: error.response?.data?.error || error.message })
    return { success: false, error: error.response?.data?.error || error.message }
  }
}

// Get reviews for a specific product
export const getProductReviews = (productId) => async (dispatch) => {
  dispatch({ type: GET_PRODUCT_REVIEWS_REQUEST })
  try {
    const { data } = await api.get(`/api/reviews/product/${productId}`)
    dispatch({ type: GET_PRODUCT_REVIEWS_SUCCESS, payload: data })
    return { success: true, data }
  } catch (error) {
    dispatch({ type: GET_PRODUCT_REVIEWS_FAILURE, payload: error.response?.data?.error || error.message })
    return { success: false, error: error.response?.data?.error || error.message }
  }
}

// Get reviews by a specific user
export const getUserReviews = () => async (dispatch) => {
  dispatch({ type: GET_USER_REVIEWS_REQUEST })
  try {
    const { data } = await api.get("/api/reviews/user")
    dispatch({ type: GET_USER_REVIEWS_SUCCESS, payload: data })
    return { success: true, data }
  } catch (error) {
    dispatch({ type: GET_USER_REVIEWS_FAILURE, payload: error.response?.data?.error || error.message })
    return { success: false, error: error.response?.data?.error || error.message }
  }
}

// Update a review
export const updateReview = (reviewId, reviewData) => async (dispatch) => {
  dispatch({ type: UPDATE_REVIEW_REQUEST })
  try {
    const { data } = await api.put(`/api/reviews/${reviewId}`, reviewData)
    dispatch({ type: UPDATE_REVIEW_SUCCESS, payload: data })
    return { success: true, data }
  } catch (error) {
    dispatch({ type: UPDATE_REVIEW_FAILURE, payload: error.response?.data?.error || error.message })
    return { success: false, error: error.response?.data?.error || error.message }
  }
}

// Delete a review
export const deleteReview = (reviewId) => async (dispatch) => {
  dispatch({ type: DELETE_REVIEW_REQUEST })
  try {
    await api.delete(`/api/reviews/${reviewId}`)
    dispatch({ type: DELETE_REVIEW_SUCCESS, payload: reviewId })
    return { success: true }
  } catch (error) {
    dispatch({ type: DELETE_REVIEW_FAILURE, payload: error.response?.data?.error || error.message })
    return { success: false, error: error.response?.data?.error || error.message }
  }
}

// Reset review state
export const resetReviewState = () => ({
  type: RESET_REVIEW_STATE,
})

