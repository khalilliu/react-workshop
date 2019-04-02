import React from "react";
import { MdMenu } from "react-icons/md";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import "./06.css";
/**
 * createMediaListener
 *
 * useage:
 * const listener = createMediaListener({
 *  mobile: "(max-width: 767px)",
 *  small: "(max-width: 568px), (max-height: 400px)"
 * })
 * listener.listen((state) => {})
 * listener.getState()
 * listenter.dispose()
 */

const createMediaListener = media => {
  let transientListener = null;
  const mediaKeys = Object.keys(media);
  const queryLists = mediaKeys.reduce((queryLists, key) => {
    queryLists[key] = window.matchMedia(media[key]);
    return queryLists;
  }, {});

  const mediaState = mediaKeys.reduce((mediaState, key) => {
    mediaState[key] = queryLists[key].matches;
    return mediaState;
  }, {});

  const notify = () => {
    if (transientListener != null) transientListener(mediaState);
  };

  const mutateMediaState = (key, val) => {
    mediaState[key] = val;
    notify();
  };
  // generate listeners for key {key: func}
  const listeners = mediaKeys.reduce((listeners, key) => {
    listeners[key] = ev => mutateMediaState(key, ev.matches);
    return listeners;
  }, {});

  const listen = listener => {
    transientListener = listener;
    mediaKeys.forEach(key => {
      queryLists[key].addListener(listeners[key]);
    });
  };

  const dispose = () => {
    transientListener = null;
    mediaKeys.forEach(key => {
      queryLists[key].removeListener(listeners[key]);
    });
  };

  const getState = () => mediaState;

  return { listen, dispose, getState };
};

const text = {
  cars: (
    <div>
      <h2>Car rentals</h2>
      <p>We offer the finest selection of cars:</p>
      <ul>
        <li>Sedans</li>
        <li>Donks</li>
        <li>Hoopdies</li>
        <li>Ghetto Sleds</li>
        <li>Trucks</li>
        <li>Wild Wheels</li>
      </ul>
    </div>
  ),

  hotels: (
    <div>
      <h2>Hotels</h2>
      <p>
        The best hotels at the best price. Whether you're looking for a romantic
        get-away or just need a place to crash that offers free breakfast and a
        hot tub, we have the best hotels around.
      </p>
    </div>
  ),
  flights: (
    <div>
      <h2>Flights</h2>
      <p>
        Cheap fare and great flights. We have the most non-stop from major
        cities across the world than anybody else.
      </p>
    </div>
  ),
  space: (
    <div>
      <h2>Space</h2>
      <p>
        Sometimes when I watch shows like Passengers, and they're experiencing
        intergallactic travel, slingshotting around a star and gazing at it out
        the window, or standing outside the ship staring into the universe, I
        get actually angry that I won't experience it. Time to find a religion
        that believes we can create worlds and travel from one to the other.
      </p>
    </div>
  )
};

const imageSrc = {
  Earth:
    "https://3c1703fe8d.site.internapcdn.net/newman/csz/news/800/2018/earthsoxygen.jpg",
  Galaxy: "http://crownandshield.ndsj.org/wp-content/uploads/2018/04/space.jpg",
  Trees:
    "http://en.es-static.us/upl/2014/07/Andromeda_Galaxy_with_h-alpha-e1406681551566.jpg"
};

const makeBackgroundComponent = image => props => (
  <div
    {...props}
    style={{
      position: "fixed",
      left: 0,
      right: 0,
      top: 200,
      bottom: 0,
      zIndex: -1,
      background: `url(${image}) center center`,
      backgroundSize: "cover"
    }}
  />
);

const Screens = Object.keys(imageSrc).reduce((prev, key) => {
  prev[key] = makeBackgroundComponent(imageSrc[key]);
  return prev;
}, {});

const withMedia = Comp => {
  const queryLists = createMediaListener({
    big: "(min-width : 1000px)",
    tiny: "(max-width: 600px)"
  });

  return class WithMedia extends React.Component {
    state = {
      media: queryLists.getState()
    };

    componentDidMount() {
      queryLists.listen(media => this.setState({ media }));
    }

    componentWillUnmount() {
      queryLists.dispose();
    }

    render() {
      const { media } = this.state;

      return <Comp media={media} />;
    }
  };
};

class Example1 extends React.Component {
  render() {
    const { media } = this.props;

    return (
      <TransitionGroup>
        <CSSTransition className="fade" timeout={500}>
          {media.big ? (
            <Screens.Galaxy key="galaxy" />
          ) : media.tiny ? (
            <Screens.Trees key="trees" />
          ) : (
            <Screens.Earth key="earth" />
          )}
        </CSSTransition>
      </TransitionGroup>
    );
  }
}

const AppWithMedia = withMedia(Example1);

// exercise
function localStorageUtil() {
  let subscribers = [];

  function set(key, val) {
    console.log(key, val);
    localStorage.setItem(key, val);
    subscribers.forEach(s => s());
  }

  function subscribe(fn) {
    subscribers.push(fn);
    const unsubscribe = () => {
      subscribers.filter(s => s !== fn);
    };
    return unsubscribe;
  }

  function get(key, default_) {
    return JSON.parse(localStorage.getItem(key)) || default_;
  }

  return {
    set,
    get,
    subscribe
  };
}

const { set, get, subscribe } = localStorageUtil();

class Exercise extends React.Component {
  state = {
    sidebarIsOpen: get("sidebarIsOpen", true)
  };

  componentDidMount() {
    this.unsubscribe = subscribe(() => {
      this.setState({
        sidebarIsOpen: get("sidebarIsOpen")
      });
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }
  render() {
    const { sidebarIsOpen } = this.state;
    return (
      <div className="board">
        <header>
          <button
            className="sidebar-toggle"
            title="Toggle menu"
            onClick={() => {
              set("sidebarIsOpen", !sidebarIsOpen);
            }}
          >
            <MdMenu />
          </button>
        </header>
        <div className="container">
          <aside className={sidebarIsOpen ? "open" : "closed"} />
          <main />
        </div>
      </div>
    );
  }
}

const withStorage = (key, default_) => Comp => {
  return class WithStorage extends React.Component {
    state = {
      [key]: get(key, default_)
    };

    componentDidMount() {
      this.unsubscribe = subscribe(() => {
        this.setState({
          [key]: get(key)
        });
      });
    }

    componentWillUnmount() {
      this.unsubscribe();
    }

    render() {
      return (
        <Comp {...this.props} keyName={key} {...this.state} setStorage={set} />
      );
    }
  };
};

class Solution extends React.Component {
  render() {
    const { keyName, setStorage } = this.props;
    const sidebarIsOpen = this.props[keyName];
    console.log(get(keyName), "sdas");
    return (
      <div className="board">
        <header>
          <button
            className="sidebar-toggle"
            title="Toggle menu"
            onClick={() => {
              setStorage(keyName, !sidebarIsOpen);
            }}
          >
            <MdMenu />
          </button>
        </header>

        <div className="container">
          <aside className={sidebarIsOpen ? "open" : "closed"} />
          <main />
        </div>
      </div>
    );
  }
}

const Solution1 = withStorage("sidebarIsOpen2", true)(Solution);

// export app
const Main = () => (
  <div>
    {/* <AppWithMedia /> */}
    <Exercise />
    <Solution1 />
  </div>
);

Main.title = "withMedia(Comp)";

export default Main;
