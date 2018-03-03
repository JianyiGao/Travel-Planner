import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Parser from 'html-react-parser';

import Places from './components/Places.js';
import Datepicker from './components/Datepicker.js';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      places: 0
    }
  }

  render() {
    const places = [];

    for (var i = 0; i < this.state.places; i += 1) {
      places.push(<PlacesComponent key={i} number={i} />);
    };

    return (
      <div className="App">
        <div class="start"></div>
        <div class="date">
          <span>Date Range</span>
          <Datepicker></Datepicker>
        </div>
        <ParentComponent addPlaces={this.onAddPlaces}>
          {places}
        </ParentComponent>
        <div class="submit"></div>
      </div>
    );
}

onAddPlaces = () => {
  this.setState({
    places: this.state.places + 1
  });
}


}

const ParentComponent = props => (
  <div class="destination">
    <Places></Places>
    <button onClick={props.addPlaces}>Add Another Destination</button>
    <div id="newPlaces">
      {props.places}
    </div>
  </div>
);

const PlacesComponent = props => <div>{"testing" + props.number}</div>;

export default App;
