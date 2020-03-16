/* eslint-disable no-dupe-keys */
import React, { Component } from 'react'
import "./Map.css"
import ReactMapGL, {GeolocateControl, Marker, Popup} from "react-map-gl"
import markerBanks from "../../resources/marker.png"
import markerCafes from "../../resources/marker_cafes.png"
import markerHospital from "../../resources/marker_hospital.png"
import axios from "axios"

export default class Map extends Component {
    
    state = {
        viewport: {
            width: "100%",
            height: "100vh",
            latitude: 51.044788,
            longitude: 13.735508,
            zoom: 12
        },
        geolocateStyle: {
            position: "absolute",
            top: 0,
            left: 0,
            margin: 10
        },
        banks: null,
        hospitals: null,
        restaurants: null,
        loading: true,
        markerClicked: false,
        markerDataActual: null,
        markerValue: "all"
    };


    async componentDidMount() {
        
        /*const url_banks = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=51.044788,13.735508&radius=4000&type=bank&key=${process.env.REACT_APP_GOOGLE_KEY}"
        const response_banks = await fetch(url_banks);
        const banks = await response_banks.json();*/
        await axios.get(`https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=51.044788,13.735508&radius=4000&type=bank&key=${process.env.REACT_APP_GOOGLE_KEY}`).then(
            res => {
                this.setState({banks: res})
            }
        )

        await axios.get(`https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=51.044788,13.735508&radius=4000&type=restaurant&key=${process.env.REACT_APP_GOOGLE_KEY}`).then(
            res => {
                this.setState({restaurants: res})
            }
        )
        await axios.get(`https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=51.044788,13.735508&radius=4000&type=hospital&key=${process.env.REACT_APP_GOOGLE_KEY}`).then(
            res => {
                this.setState({hospitals: res})
            }
        )
        
        /*const url_restaurants = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=51.044788,13.735508&radius=4000&type=restaurant&key=${process.env.REACT_APP_GOOGLE_KEY}"       
        const response_restaurants = await fetch(url_restaurants)
        const restaurants = await response_restaurants.json();*/
        
        this.setState({loading: false})
    }

    handleClick = (markerData) => {
        this.setState({markerClicked: true, markerDataActual: markerData});
    }

    clickedOnSidbar = (markerDate) => {

    }

    handleClose = () =>{
        this.setState({markerClicked: false});
    }

    handleChange = (event) => {
        this.setState({markerValue: event.target.value})
    }
    

    render() {
        return(
            <div>
                <div className="map">
                    <div className="dropdown">
                        <div className="legends">
                            <h3>Legende</h3>
                            <img src={markerBanks} alt={markerBanks} width="30"/>
                            <p>Banken</p>
                            <img src={markerCafes} alt={markerCafes} width="30"/>
                            <p>Restaurants</p>
                            <img src={markerHospital} alt={markerHospital} width="30"/>
                            <p>Krankenhäuser</p>
                        </div>
                        <p>Hier auswählen welche Marker Sie angezeigt haben wollen</p>
                        <select value={this.state.markerValue} onChange={this.handleChange}>
                            <option value="all">Alle</option>
                            <option value="banks">Banken</option>
                            <option value="restaurants">Restaurants</option>
                            <option value="doctor">Krankenhäuser</option>
                        </select>
                    </div>
                    <div className="map-wrapper">
                        <div>
                            <ReactMapGL
                                {...this.state.viewport}
                                onViewportChange={(viewport) => this.setState({viewport})}
                                mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
                                mapStyle="mapbox://styles/mapbox/streets-v11">
                                <GeolocateControl
                                    style={this.state.geolocateStyle}
                                    positionOptions={{enableHighAccuracy: true}}
                                    trackUserLocation={true}
                                />
                                {!this.state.loading ? (
                                <div>
                                    {this.state.markerValue === "banks" || this.state.markerValue === "all" ? this.state.banks.data.results.map(bank => (
                                    <Marker key={bank.id} latitude={bank.geometry.location.lat} longitude={bank.geometry.location.lng}>
                                        <button className="marker-btn"
                                        onClick={e => {
                                            e.preventDefault();
                                            this.handleClick(bank)
                                        }}>
                                            <img src={markerBanks} alt={markerBanks}/>
                                        </button>
                                        
                                    </Marker>
                                    )): null}

                                    {this.state.markerValue === "restaurants" || this.state.markerValue === "all" ? this.state.restaurants.data.results.map((restaurant) => (
                                    <Marker key={restaurant.id} latitude={restaurant.geometry.location.lat} longitude={restaurant.geometry.location.lng}>
                                        <button className="marker-btn"
                                        onClick={e => {
                                            e.preventDefault();
                                            this.handleClick(restaurant)
                                        }}>
                                            <img src={markerCafes} alt={markerCafes}/>
                                        </button>
                                    </Marker>
                                    )) : null}
                                    {this.state.markerValue === "doctor" || this.state.markerValue === "all" ? this.state.hospitals.data.results.map((hospital) => (
                                    <Marker key={hospital.id} latitude={hospital.geometry.location.lat} longitude={hospital.geometry.location.lng}>
                                        <button className="marker-btn"
                                        onClick={e => {
                                            e.preventDefault();
                                            this.handleClick(hospital)
                                        }}>
                                            <img src={markerHospital} alt={markerHospital}/>
                                        </button>
                                    </Marker>
                                    )) : null}
                                    {this.state.markerClicked ? (
                                        <Popup onClose={() => {
                                            this.handleClose()}} latitude={this.state.markerDataActual.geometry.location.lat} longitude={this.state.markerDataActual.geometry.location.lng}
                                            >
                                            <div className="popup-content">
                                                <h4>Name: {this.state.markerDataActual.name}</h4>
                                                {this.state.markerDataActual.vicinity !== "" ?
                                                <h4>Adresse: {this.state.markerDataActual.vicinity}</h4>
                                                : <h4>Adresse: nicht vorhanden</h4>
                                                }
                                            </div>
                                        </Popup>
                                    ) : null}
                                </div>
                                ) : null}
                            </ReactMapGL>
                        </div>
                    </div>
                </div>            
           </div>
        );
    }
}