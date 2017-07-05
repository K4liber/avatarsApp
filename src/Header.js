import React, { Component } from 'react';

import { store } from './Store.js'

class Header extends Component {
    componentWillMount() {
      let HeaderComponent = this;
      store.subscribe(function(){
        HeaderComponent.forceUpdate();
      })
    }
    render() {
        let state = store.getState();
        return (
            <div className="menu header">
              <button disabled={!(state.page > 1)} type="button" className="btn btn-default" 
                  onClick={() => store.dispatch({ type : 'PREVIOUSPAGE'})}>
                {"<"}
              </button>
                {state.page} / {state.pages}
              <button disabled={!(state.pages > state.page)} type="button" className="btn btn-default" 
                  onClick={() => store.dispatch({ type : 'NEXTPAGE'})}>
                {">"}
              </button>
            </div>
        )
    }
}

export default Header;