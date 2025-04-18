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

const initialState = {
  productReviews: [],
  userReviews: [],
  loading: false,
  error: null,
  success: false,
}

export const reviewReducer = (state = initialState, action) => {
  switch (action.type) {
    // Create review
    case CREATE_REVIEW_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        success: false,
      }
    case CREATE_REVIEW_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        success: true,
        productReviews: [action.payload, ...state.productReviews],
        userReviews: [action.payload, ...state.userReviews],
      }
    case CREATE_REVIEW_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        success: false,
      }

    // Get product reviews
    case GET_PRODUCT_REVIEWS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      }
    case GET_PRODUCT_REVIEWS_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        productReviews: action.payload,
      }
    case GET_PRODUCT_REVIEWS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      }

    // Get user reviews
    case GET_USER_REVIEWS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      }
    case GET_USER_REVIEWS_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        userReviews: action.payload,
      }
    case GET_USER_REVIEWS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      }

    // Update review
    case UPDATE_REVIEW_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        success: false,
      }
    case UPDATE_REVIEW_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        success: true,
        productReviews: state.productReviews.map((review) =>
          review._id === action.payload._id ? action.payload : review,
        ),
        userReviews: state.userReviews.map((review) => (review._id === action.payload._id ? action.payload : review)),
      }
    case UPDATE_REVIEW_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        success: false,
      }

    // Delete review
    case DELETE_REVIEW_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        success: false,
      }
    case DELETE_REVIEW_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        success: true,
        productReviews: state.productReviews.filter((review) => review._id !== action.payload),
        userReviews: state.userReviews.filter((review) => review._id !== action.payload),
      }
    case DELETE_REVIEW_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        success: false,
      }

    // Reset review state
    case RESET_REVIEW_STATE:
      return {
        ...state,
        loading: false,
        error: null,
        success: false,
      }

    default:
      return state
  }
}
