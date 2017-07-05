import React, { Component } from 'react';
import createBrowserHistory from 'history/createBrowserHistory';

import './App.css';

import Header from './Header.js';
import Images from './Images.js';
import Footer from './Footer.js';
import store from './Store.js';

export const imagesPerPage = 10;
export const hostName = "http://localhost:8080";
export var browserHistory = createBrowserHistory();

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
