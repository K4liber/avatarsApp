import React, { Component } from 'react';
import request from 'superagent';

import { hostName } from './App.js';
import { store } from './Store.js';
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
            xhr.responseType = "blob";
            xhr.onload = function() {
                blob = xhr.response;
                if ( blob && blob.size && blob.type) {
                    var image = new ImageClass(getImageUrl, element, blob.size, blob.type);
                    store.dispatch({
                        type: 'PUSHIMAGE',
                        image: image
                    })
                }
            }
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4 && xhr.status !== 200){ 
                    alert("Cannot download avatar from " + getImageUrl);
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