import { createStore } from 'redux'

import { imagesPerPage, browserHistory } from './App.js'

function compareBySize(a,b) {
  if (a.size < b.size)
    return -1;
  if (a.size > b.size)
    return 1;
  return 0;
}

function compareByName(a,b) {
  if (a.name < b.name)
    return -1;
  if (a.name > b.name)
    return 1;
  return 0;
}

const reducer = (state = {
  images : [],
  page : 1,
  pages : 1,
}, action) => {
  switch (action.type) {
    case 'NEXTPAGE': {
      if (state.images.length/imagesPerPage > state.page) {
        state.page = state.page+1;
        browserHistory.push("/page/" + state.page);
      }
      return state;
    }
    case 'PREVIOUSPAGE': {
      if (state.page > 1) {
        state.page = state.page-1;
        browserHistory.push("/page/" + state.page);
      }
      return state;
    }
    case 'SORTBYSIZE' : {
      let images = state.images.sort(compareBySize);
      state.images = images;
      return state;
    }
    case 'SORTBYNAME' : {
      let images = state.images.sort(compareByName);
      state.images = images;
      return state;
    }
    case 'PUSHIMAGE': {
      let images = state.images;
      images.push(action.image);
      state.images = images;
      state.pages = 1 + parseInt((images.length - 1)/imagesPerPage, 10);
      return state;
    }
    case 'GOTOPAGE': {
      state.page = action.page;
      return state;
    }
    default :
      return state;
  }
}

export const store = createStore(reducer);

export default store;