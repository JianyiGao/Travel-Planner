import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Parser from 'html-react-parser';

import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete'

const renderSuggestion = ({ formattedSuggestion }) => (
  <div className="Demo__suggestion-item">
    <strong>{formattedSuggestion.mainText}</strong>{' '}
    <small className="text-muted">{formattedSuggestion.secondaryText}</small>
  </div>
)

const shouldFetchSuggestions = ({ value }) => value.length > 2

const onError = (status, clearSuggestions) => {
  console.log(
    'Error happened while fetching suggestions from Google Maps API',
    status
  )
  clearSuggestions()
}

class Places extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: '',
      geocodeResults: null,
      loading: false
    }
    this.handleSelect = this.handleSelect.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  handleSelect(address) {
    this.setState({
      address,
      loading: true,
    })
   geocodeByAddress(address)
     .then(results => getLatLng(results[0]))
     .then(({ lat, lng }) => {
       console.log('Geocode Success', { lat, lng })
       this.setState({
         geocodeResults: this.renderGeocodeSuccess(lat, lng),
         loading: false,
       })
     })
     .catch(error => {
       console.log('Geocode Error', error)
       this.setState({
         geocodeResults: this.renderGeocodeFailure(error),
         loading: false,
       })
     })
  }

  handleChange(address) {
    this.setState({
      address,
      geocodeResults: null,
    })
  }

  renderGeocodeFailure(err) {
    return (
      <div className="alert alert-danger" role="alert">
        <strong>Error!</strong> {err}
      </div>
    )
  }

  renderGeocodeSuccess(lat, lng) {
    return (
      <div className="alert alert-success" role="alert">
        <strong>Success!</strong> Geocoder found latitude and longitude:{' '}
        <strong>
          {lat}, {lng}
        </strong>
      </div>
    )
  }

  render() {
    const inputProps = {
      value: this.state.address,
      onChange: this.handleChange,
      onBlur: () => {
        console.log('blur!')
      },
      type: 'search',
      placeholder: 'Search Places...',
      autoFocus: true
    }

    return (
      <PlacesAutocomplete
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
        onSelect={this.handleSelect}
        onEnterKeyDown={this.handleSelect}
        onError={onError}
        shouldFetchSuggestions={shouldFetchSuggestions}
      />
    );
  }
}
export default Places;
