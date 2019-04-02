import React, { Component, PureComponent, createContext } from "react";
import {
  FaCarAlt,
  FaBed,
  FaPlane,
  FaSpaceShuttle,
  FaPlay,
  FaPause,
  FaRepeat,
  FaUndoAlt,
  FaRedoAlt,
  FaForward,
  FaBackward
} from "react-icons/fa";
import * as PropTypes from "prop-types";
import "./05.css";

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

const TabContext = createContext();

class Tabs extends Component {
  state = {
    activeIndex: 0
  };

  getContext() {
    return {
      activeIndex: this.state.activeIndex,
      onSelectTab: this.selectTabIndex
    };
  }

  selectTabIndex = activeIndex => {
    this.setState({ activeIndex });
  };

  render() {
    return (
      <TabContext.Provider value={this.getContext()}>
        <div className="Tabs">{this.props.children}</div>
      </TabContext.Provider>
    );
  }
}

class TabList extends Component {
  render() {
    return (
      <TabContext.Consumer>
        {context => {
          const { activeIndex } = context;
          const children = React.Children.map(
            this.props.children,
            (child, index) => {
              return React.cloneElement(child, {
                isActive: index === activeIndex,
                onSelect: () => context.onSelectTab(index)
              });
            }
          );
          return <div className="tabs">{children}</div>;
        }}
      </TabContext.Consumer>
    );
  }
}

class Tab extends Component {
  render() {
    const { isActive, isDisabled, onSelect } = this.props;
    return (
      <div
        className={
          isDisabled ? "tab disabled" : isActive ? "tab active" : "tab"
        }
        onClick={isDisabled ? null : onSelect}
      >
        {this.props.children}
      </div>
    );
  }
}

class TabPanels extends Component {
  render() {
    return (
      <TabContext.Consumer>
        {context => {
          const { children } = this.props;
          const { activeIndex } = context;
          return <div className="panels">{children[activeIndex]}</div>;
        }}
      </TabContext.Consumer>
    );
  }
}

class TabPanel extends Component {
  render() {
    return this.props.children;
  }
}

class Blocker extends PureComponent {
  render() {
    return this.props.children;
  }
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <Tabs>
          <Blocker>
            <TabList>
              <Tab>
                <FaCarAlt />
              </Tab>
              <Tab>
                <FaBed />
              </Tab>
              <Tab>
                <FaPlane />
              </Tab>
              <Tab>
                <FaSpaceShuttle />
              </Tab>
            </TabList>
          </Blocker>
          <div>
            <TabPanels>
              <TabPanel>{text.cars}</TabPanel>
              <TabPanel>{text.hotels}</TabPanel>
              <TabPanel>{text.flights}</TabPanel>
              <TabPanel>{text.space}</TabPanel>
            </TabPanels>
          </div>
        </Tabs>
      </div>
    );
  }
}

//exercise
const audiosrc =
  "http://66.90.93.122/ost/super-mario-bros/zawombix/01%20-%20Super%20Mario%20Bros.mp3";

const AudioContext = React.createContext();

class AudioPlayer extends Component {
  state = {
    isPlaying: false,
    duration: null,
    currentTime: 0,
    loaded: false
  };

  getContext() {
    return {
      audio: {
        ...this.state,
        jump: time => {
          this.audio.currentTime = this.audio.currentTime + time;
        },
        play: () => {
          this.setState({ isPlaying: true });
          this.audio.play();
        },
        pause: () => {
          this.setState({ isPlaying: false });
          this.audio.pause();
        },
        setTime: currentTime => {
          this.audio.currentTime = currentTime;
        }
      }
    };
  }

  handleAudioLoaded = e => {
    this.setState({
      duration: this.audio.duration,
      loaded: true
    });
  };

  handleTimeUpdate = e => {
    this.setState({
      currentTime: this.audio.currentTime,
      duration: this.audio.duration
    });
  };

  handleEnded = () => {
    this.setState({
      isPlaying: false
    });
  };

  render() {
    return (
      <AudioContext.Provider value={this.getContext()}>
        <div className="audio-player">
          <audio
            src={this.props.source}
            onTimeUpdate={this.handleTimeUpdate}
            onLoadedData={this.handleAudioLoaded}
            onEnded={this.handleEnded}
            ref={n => (this.audio = n)}
          />
          {this.props.children}
        </div>
      </AudioContext.Provider>
    );
  }
}

class Play extends Component {
  render() {
    return (
      <AudioContext.Consumer>
        {context => (
          <button
            className="icon-button"
            onClick={context.audio.play}
            disabled={context.audio.isPlaying}
            title="play"
          >
            <FaPlay />
          </button>
        )}
      </AudioContext.Consumer>
    );
  }
}

class Pause extends React.Component {
  render() {
    return (
      <AudioContext.Consumer>
        {context => (
          <button
            className="icon-button"
            onClick={context.audio.pause}
            disabled={!context.audio.isPlaying}
            title="pause"
          >
            <FaPause />
          </button>
        )}
      </AudioContext.Consumer>
    );
  }
}

class PlayPause extends Component {
  render() {
    return (
      <AudioContext.Consumer>
        {context => (context.audio.isPlaying ? <Pause /> : <Play />)}
      </AudioContext.Consumer>
    );
  }
}

class JumpForward extends Component {
  render() {
    return (
      <AudioContext.Consumer>
        {context => (
          <button
            className="icon-button"
            onClick={() => context.audio.jump(10)}
            disabled={!context.audio.isPlaying}
            title="Forward 10 Seconds"
          >
            <FaRedoAlt />
          </button>
        )}
      </AudioContext.Consumer>
    );
  }
}

class JumpBack extends Component {
  render() {
    return (
      <AudioContext.Consumer>
        {context => {
          return (
            <button
              className="icon-button"
              onClick={() => context.audio.jump(-10)}
              disabled={!context.audio.isPlaying}
              title="Back 10 Seconds"
            >
              <FaUndoAlt />
            </button>
          );
        }}
      </AudioContext.Consumer>
    );
  }
}

class Progress extends Component {
  render() {
    return (
      <AudioContext.Consumer>
        {context => {
          const {
            audio: { loaded, duration, currentTime, setTime }
          } = context;
          const handleClick = e => {
            const rect = this.node.getBoundingClientRect();
            const clientLeft = e.clientX;
            const relativeLeft = clientLeft - rect.left;
            setTime((relativeLeft / rect.width) * duration);
          };
          return (
            <div
              ref={n => (this.node = n)}
              className="progress"
              onClick={e => handleClick(e)}
            >
              <div
                className="progress-bar"
                style={{
                  width: loaded ? `${(currentTime / duration) * 100}%` : "0%"
                }}
              />
            </div>
          );
        }}
      </AudioContext.Consumer>
    );
  }
}

const Exercise = () => (
  <div className="exercies">
    <AudioPlayer source={audiosrc}>
      <Play />
      <Pause />
      <span className="player-text"> Mario Bros. Remix</span>
      <Progress />
    </AudioPlayer>

    <AudioPlayer source={audiosrc}>
      <PlayPause />
      <JumpBack />
      <JumpForward />
      <span className="player-text">Mario Bros. Remix-02</span>
      <Progress />
    </AudioPlayer>
  </div>
);

// app

const Main = () => (
  <div>
    <App />
    <hr />
    <Exercise />
  </div>
);

Main.title = "use context rebuild taps";

export default Main;
