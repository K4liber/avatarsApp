import React, { Component } from 'react';
import { createStore } from 'redux'
import createBrowserHistory from 'history/createBrowserHistory';

import './App.css';

import Header from './Header.js';
import Images from './Images.js';
import Footer from './Footer.js';

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
export const imagesPerPage = 10;
export const hostName = "http://localhost:8080";
var browserHistory = createBrowserHistory();

class App extends Component{
  componentWillMount() {
    var res = String(window.location).split("/"); 
    let page = parseInt(res[4], 10);
    if ( res && res[4] && res[3] === "page" && typeof page === "number" && Number.isInteger(page)) {
        store.dispatch({ 
            type: 'GOTOPAGE',
            page: page
        });
    } else {
        browserHistory.push("/");
    }
  }
  render() {
    return (
      <div>
        <Header/>
        <Images/>
        <Footer/>
      </div>
    );
  }
}

export default App;
