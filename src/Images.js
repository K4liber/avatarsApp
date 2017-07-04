import React, { Component } from 'react';
import request from 'superagent';

import { hostName } from './App.js';
import { store } from './App.js';
import { imagesPerPage } from './App.js';

import ImageClass from './ImageClass.js';

class Images extends Component{
    state = ({
        images: []
    })
    componentWillMount() {
        let imagesComponent = this;
        let getImagesListUrl = hostName + "/api/getImagesList";
        let getImages = request
            .get(getImagesListUrl);
        getImages.end(function(err, res){
            if ( res && res.status === 200 ) {
                let imagesNames = JSON.parse(res.text);
                if ( imagesNames ) {
                    imagesComponent.loadImages(imagesNames);
                }
            } else {
                alert("I can't get images list.")
            }
        });
        store.subscribe(function(){
            let state = store.getState();
            imagesComponent.setState({
                images: state.images.slice(imagesPerPage*(state.page-1), imagesPerPage*(state.page))
            })
        })
    }
    loadImages(imagesNames) {
        imagesNames.map(function(element, index) {
            let getImageUrl = hostName + "/images/" + element;
            var blob = null;
            var xhr = new XMLHttpRequest();
            xhr.open("GET", getImageUrl);
            xhr.responseType = "blob";//force the HTTP response, response-type header to be blob
            xhr.onload = function()
            {
                blob = xhr.response;//xhr.response is now a blob object
                if ( blob && blob.size && blob.type) {
                    var image = new ImageClass(getImageUrl, element, blob.size, blob.type);
                    store.dispatch({
                        type: 'PUSHIMAGE',
                        image: image
                    })
                }
            }
            xhr.send();
            return element;
        });
    }
    render() {
        return (
            <div className="images">
                {
                    this.state.images.map(function(element, index) {
                        return (
                            <img className="image" src={element.url} alt="" key={"image" + index}/>
                        )
                    })
                }
            </div>
        )
    }
}

export default Images;