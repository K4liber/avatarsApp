import React, { Component } from 'react';

import { store } from './App.js'

class Header extends Component {
    state = {
       page: store.getState().page
    }
    componentWillMount() {
      let HeaderComponent = this;
      store.subscribe(function(){
        HeaderComponent.setState({
          page: store.getState().page 
        })
      })
    }
    render() {
        return (
            <div className="menu header">
              <button type="button" className="btn btn-default" onClick={() => store.dispatch({ type : 'PREVIOUSPAGE'})}>
                {"<"}
              </button>
                {this.state.page}
              <button type="button" className="btn btn-default" onClick={() => store.dispatch({ type : 'NEXTPAGE'})}>
                {">"}
              </button>
            </div>
        )
    }
}

export default Header;