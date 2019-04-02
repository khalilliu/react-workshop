import React from "react";
import {
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow
} from "react-google-maps";
import "./07.css";

const getHeaderStyle = y => {
  const pin = y >= 300;
  const top = -y / 2;
  return {
    top: pin ? "0px" : `${top + 150}px`,
    textShadow: pin
      ? `0px ${(y - 300) / 5}px ${Math.min(
          (y - 300) / 10,
          50
        )}px rgba(0,0,0,0.5)`
      : "none"
  };
};

class ScrollY extends React.Component {
  state = { y: 0 };
  handleWindowScroll = () => this.setState({ y: window.scrollY });
  componentDidMount() {
    this.handleWindowScroll();
    window.addEventListener("scroll", this.handleWindowScroll);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleWindowScroll);
  }

  render() {
    return this.props.children(this.state.y);
  }
}

class Example extends React.Component {
  render() {
    return (
      <div className="example7">
        <ScrollY>
          {y => <h1 style={getHeaderStyle(y)}>Scroll down!</h1>}
        </ScrollY>
      </div>
    );
  }
}

// exercise
const loadMaps = cb => {
  // google maps script loading garbage
  const KEY = "AIzaSyDFwu1MmuOatqW-283LSCbsxqHcp89ouiw";
  const URL = `https://maps.googleapis.com/maps/api/js?key=${KEY}&callback=_mapsLoaded`;
  window._mapsLoaded = cb;
  const script = document.createElement("script");
  script.src = URL;
  document.body.appendChild(script);
};

const InnerMap = withGoogleMap(({ lat, lng, info }) => (
  <GoogleMap defaultZoom={5} center={{ lat, lng }}>
    <Marker position={{ lat, lng }} defaultAnimation="2">
      {info && (
        <InfoWindow>
          <div>{info}</div>
        </InfoWindow>
      )}
    </Marker>
  </GoogleMap>
));

class Map extends React.Component {
  componentWillMount() {
    if (!window.google) {
      loadMaps(() => {
        this.forceUpdate();
      });
    }
  }

  render() {
    const { lat, lng, info } = this.props;
    return window.google ? (
      <InnerMap
        containerElement={<div className="container" />}
        mapElement={<div className="map" />}
        lat={lat}
        lng={lng}
        info={info}
      />
    ) : null;
  }
}

// get AddressFromCoords

const GoogleMapsAPI = "https://maps.googleapis.com/maps/api";
const getAddressFromCoords = (lat, lng) => {
  const url = `${GoogleMapsAPI}/geocode/json?latlng=${lat},${lng}`;
  return fetch(url)
    .then(res => res.json())
    .then(json => json.results[0].formatted_address);
};

// LoadingDots
class LoadingDots extends React.Component {
  static defaultProps = {
    interval: 300,
    dots: 3
  };

  state = { frame: 1 };

  componentDidMount() {
    this.interval = setInterval(() => {
      this.setState({
        frame: this.state.frame + 1
      });
    }, this.props.interval);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    let dots = this.state.frame % (this.props.dots + 1);
    let text = "";
    while (dots > 0) {
      text += ".";
      dots--;
    }

    return <span className="loading-dots">{text}</span>;
  }
}

// exercise App

class GeoAddress extends React.Component {
  state = {
    address: null,
    error: null
  };

  componentDidMount() {
    if (this.props.coords) this.fetchAddress();
  }

  componentDidUpdate(nextProps) {
    if (nextProps.coords !== this.props.coords) {
      this.fetchAddress();
    }
  }

  fetchAddress() {
    const { lat, lng } = this.props.coords;
    getAddressFromCoords({ lat, lng }).then(address => {
      this.setState({ address });
    });
  }

  render() {
    return this.props.children(this.state);
  }
}

class GeoPosition extends React.Component {
  state = {
    coords: null,
    error: null
  };

  componentDidMount() {
    this.geoId = navigator.geolocation.watchPosition(
      position => {
        this.setState({
          coords: {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
        });
      },
      error => {
        this.setState({ error });
      }
    );
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.geoId);
  }

  render() {
    return this.props.children(this.state);
  }
}

class ExerciseApp extends React.Component {
  render() {
    return (
      <div className="app">
        <GeoAddress>
          {state =>
            state.error ? (
              <div>Error: {state.error.message}</div>
            ) : state.coords ? (
              <GeoAddress coords={state.coords}>
                {({ error, address }) => (
                  <Map
                    lat={state.coords.lat}
                    lng={state.coords.lng}
                    info={error || address || "loading..."}
                  />
                )}
              </GeoAddress>
            ) : (
              <LoadingDots />
            )
          }
        </GeoAddress>
      </div>
    );
  }
}

// app
const App = () => (
  <div>
    {/* <Example /> */}
    <ExerciseApp />
  </div>
);

App.title = "render props";

export default App;
