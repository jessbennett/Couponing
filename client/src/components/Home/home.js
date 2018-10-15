import React, { Component } from 'react';
import './home.css';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      geolocation: '',
      latitude: '',
      longitude: '',
      coupons: ''
    };
  }

  componentDidMount () {
    const CouponsMaker = (props) => {
      try {
        const content = props.map((coupons) =>
        <div className="coupon" id={coupons._id}>
        <h1 className = "exampleTitle">{coupons.title}</h1>
        <img  className = "exampleImage" src={coupons.base64image} alt="Example showing how your custom upload will appear on the coupon"/>
        <div className="pricing">
          <div className='oldPrice'>
              Was: {(coupons.currentPrice - 0).toFixed(2)}$
          </div>
          <div className='percentOff'>
              {(((coupons.currentPrice - coupons.discountedPrice)/coupons.currentPrice)*100).toFixed(2)}% Percent Off!
          </div>
          <br/>
          <div className='newPrice'>
              Now: {(coupons.discountedPrice - 0).toFixed(2)}$
          </div>
          <div className='savings'>
              Save: {(coupons.currentPrice - coupons.discountedPrice).toFixed(2)}$
          </div>
          <br/>
          <hr/>
          <div className="amountLeft">
              Only {coupons.amountCoupons} Coupons Left!
          </div>
        <hr/>
        <div className="description">
        <br/>
          <p>{coupons.textarea}</p>
          <br/>
          <hr/>
          <br/>
          <p className="timeLeft"> Don't delay, only <strong>{coupons.lengthInDays}</strong> left until these coupons expire! </p>
          <hr/>
          <br/>
          <p>{coupons.address}</p>
          <hr/>
          <br/>
          <button className="getCoupon" onClick={this.getCoupons.bind(this, coupons._id)}> Get Coupon </button>
        </div>
        <br/>
      </div>
    </div>
        );
        return (
        <div className='flextape'>
            {content}
          </div>
        );
      } catch (error) {
        alert("Unable to automatically search for coupons. Try searching manually.")
      }
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } 
    const that = this;
    const google = window.google
    // eslint-disable-next-line
    const geocoder = new google.maps.Geocoder;
    async function cityNotFound () {
      try {
        const url = '/api/getSponseredCoupons/nocityfound'
        const response = await fetch(url);
        const data = await response.json();
        that.setState({coupons: CouponsMaker(data.coupons)})     
      } catch (error) {}
    }
    // Todo: TRY/CATCH error for geolocator
    function showPosition(position) {
      that.setState({
        geolocation: position.coords.latitude + " " + position.coords.longitude,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      })
      const latlng = {lat: parseFloat(that.state.latitude), lng: parseFloat(that.state.longitude)};
      geocoder.geocode({'location': latlng}, async (results, status) => {
        if (status === 'OK') {
          if (results[0]) {
            let city = results[0].address_components.filter((addr) => {
              return (addr.types[0] === 'locality')?1:(addr.types[0] === 'administrative_area_level_1')?1:0;
            });
            if(city[0]) city = JSON.stringify(city[0].long_name).toLowerCase()
            if (city.length > 0 || city.length > 1) {
              const url = '/api/getSponseredCoupons/'+city
              const response = await fetch(url);
              const data = await response.json();
              // CouponsMaker(data.coupons)
              that.setState({coupons: CouponsMaker(data.coupons)})
            } else cityNotFound();
          } else cityNotFound();
        } else cityNotFound();
      });
    }
  }

  async getCoupons(id) {
    this.props.parentMethod(id)
  }

  render() {
    return (
      <div>
          
        <div className="center">
          <h2>Coupons near you</h2>
        </div>
        {this.state.coupons}
      </div>
    );
  }
}

export default Home
