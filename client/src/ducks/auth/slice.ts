import { createSlice } from '@reduxjs/toolkit'
import { isSuccessResponse } from '../../types/response'
import { checkAuth, login, logout, refresh } from './thunks'

interface InitialState {
  accessToken?: string
  refreshToken?: string
  error?: string
  authenticated?: boolean
}

const initialState: InitialState = {
  accessToken: localStorage.getItem('access') || undefined,
  refreshToken: localStorage.getItem('refresh') || undefined,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addMatcher(login.fulfilled.match, (_, action) => {
      if (isSuccessResponse(action.payload)) {
        localStorage.setItem('access', action.payload.data.accessToken)
        localStorage.setItem('refresh', action.payload.data.refreshToken)

        return {
          accessToken: action.payload.data.accessToken,
          refreshToken: action.payload.data.refreshToken,
          authenticated: true,
        }
      } else {
        return {
          error: action.payload.error,
          authenticated: false,
        }
      }
    })

    builder.addMatcher(login.rejected.match, (_, action) => {
      return {
        error: action.error.message,
        authenticated: false,
      }
    })

    builder.addMatcher(checkAuth.fulfilled.match, (state, action) => {
      state.authenticated = action.payload
    })

    builder.addMatcher(checkAuth.rejected.match, (state) => {
      state.authenticated = false
    })

    builder.addMatcher(logout.fulfilled.match, (state) => {
      localStorage.removeItem('access')
      localStorage.removeItem('refresh')
      state.authenticated = false
    })

    builder.addMatcher(logout.rejected.match, (state) => {
      localStorage.removeItem('access')
      localStorage.removeItem('refresh')
      state.authenticated = false
    })

    builder.addMatcher(refresh.fulfilled.match, (state, action) => {
      if (isSuccessResponse(action.payload)) {
        localStorage.setItem('access', action.payload.data.accessToken)
        localStorage.setItem('refresh', action.payload.data.refreshToken)

        return {
          accessToken: action.payload.data.accessToken,
          refreshToken: action.payload.data.refreshToken,
          authenticated: true,
        }
      } else {
        localStorage.removeItem('access')
        localStorage.removeItem('refresh')
        state.authenticated = false
      }
    })
  },
})
