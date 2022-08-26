import React, {useEffect, useState} from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import {fromLonLat} from "ol/proj";
import {Feature} from "ol";
import {Fill, Stroke, Style} from "ol/style";
import CircleStyle from "ol/style/Circle";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import {Point} from "ol/geom";

const PublicMap = () => {
    const [map, setMap] = useState(null);
    const [positionFeature, setPositionFeature] = useState(new Feature());

    useEffect(() => {
        positionFeature.setStyle(
            new Style({
                image: new CircleStyle({
                    radius: 6,
                    fill: new Fill({
                        color: '#2109ee',
                    }),
                    stroke: new Stroke({
                        color: '#fff',
                        width: 2,
                    }),
                }),
            })
        );

        let maps = new Map({
            target: "map",
            layers: [
                new TileLayer({
                    source: new OSM()
                }),
                new VectorLayer({
                    source: new VectorSource({
                        features: [positionFeature],
                    })
                })
            ],
            view: new View({
                center: fromLonLat(fromLonLat([0, 0])),
                zoom: 1
            }),
        });

        setMap(maps);

        return () => {
            return maps.setTarget(undefined)
        };

    }, []);

    const getTheLocation = () => {
        navigator.geolocation.getCurrentPosition(onGetLocationSuccess, onGetLocationFailed);
    };

    const onGetLocationSuccess = (position) => {
        positionFeature.setGeometry(new Point(fromLonLat([position.coords.longitude, position.coords.latitude])))

        if (map) {
            map.getView().animate(
                {
                    center: fromLonLat([position.coords.longitude, position.coords.latitude]),
                    duration: 2000,
                    zoom: 15
                }
            );
        }
    };

    const onGetLocationFailed = (error) => {
        console.error(error);
    };

    return (
        <div>
            <h1 className='text'>Find Your Location</h1>
            <div id="map" style={{width: "100%", height: "500px"}}></div>
            <div className='btn-container'>
                <button className='locate-btn' onClick={getTheLocation}>Locate Me</button>
            </div>
        </div>
    );
};

export default PublicMap;
