import React, { Component } from 'react';

import { store } from './App.js';

class Footer extends Component {
    render() {
        return (
            <div className="menu footer">
                <button type="button" className="btn btn-default" 
                    onClick={() => store.dispatch({ type : 'SORTBYSIZE'})}>
                    Sort by size
                </button>
                <button type="button" className="btn btn-default" 
                    onClick={() => store.dispatch({ type : 'SORTBYNAME'})}>
                    Sort by name
                </button>
            </div>
        )
    }
}

export default Footer;