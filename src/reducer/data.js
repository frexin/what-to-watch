import adapter from './../adapter.js';

const initialState = {
  currentGenre: `All genres`,
  moviesList: [],
  isAuthorizationRequired: true,
  userData: null
};

const ActionType = {
  LOAD_MOVIES: `LOAD_MOVIES`,
  LOAD_USER: `LOAD_USER`,
  CHANGE_GENRE: `CHANGE_GENRE`,
  CHANGE_AUTH_REQUIRE: `CHANGE_AUTH_REQUIRE`,
  GET_MOVIES_BY_GENRE: `GET_MOVIES_BY_GENRE`,
  GET_MOVIE_BY_ID: `GET_MOVIE_BY_ID`
};

const Operation = {
  loadMovies: () => (dispatch, _getState, api) => {
    return api.get(`/films`)
        .then((resp) => {
          const movies = adapter(resp.data);
          dispatch(ActionCreator.loadMovies(movies));
        });
  },
  auth: (userEmail, userPassword) => (dispatch, _getState, api) => {
    return api.post(`/login`, {email: userEmail, password: userPassword})
        .then((resp) => {
          const userData = adapter(resp.data);

          dispatch(ActionCreator.changeAuthRequire(false));
          dispatch(ActionCreator.loadUser(userData));
        });
  },
  checkAuth: () => (dispatch, _getState, api) => {
    return api.get(`/login`)
        .then((resp) => {
          const userData = adapter(resp.data);

          dispatch(ActionCreator.changeAuthRequire(false));
          dispatch(ActionCreator.loadUser(userData));
        }).catch(() => {
          dispatch(ActionCreator.changeAuthRequire(true));
        });
  },
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.LOAD_MOVIES:
      return Object.assign({}, state, {
        moviesList: action.payload
      });

    case ActionType.CHANGE_GENRE:
      return Object.assign({}, state, {
        currentGenre: action.payload,
      });

    case ActionType.GET_MOVIE_BY_ID:
      return Object.assign({}, state, {
        movie: state.moviesList.filter((item) => item.id === action.payload)[0]
      });

    case ActionType.CHANGE_AUTH_REQUIRE:
      return Object.assign({}, state, {
        isAuthorizationRequired: action.payload
      });

    case ActionType.LOAD_USER:
      return Object.assign({}, state, {
        userData: action.payload
      });
  }

  return state;
};

const ActionCreator = {
  loadMovies: (movies) => {
    return {
      type: ActionType.LOAD_MOVIES,
      payload: movies
    };
  },
  changeGenre: (genre) => ({
    type: ActionType.CHANGE_GENRE,
    payload: genre
  }),
  selectMovie: (movieId) => ({
    type: ActionType.GET_MOVIE_BY_ID,
    payload: movieId
  }),
  changeAuthRequire: (authRequire) => ({
    type: ActionType.CHANGE_AUTH_REQUIRE,
    payload: authRequire
  }),
  loadUser: (userData) => ({
    type: ActionType.LOAD_USER,
    payload: userData
  }),
};

export {
  ActionCreator, ActionType, reducer, Operation
};
