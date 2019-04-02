import React, { Component } from "react";
import { unstable_createReturn, unstable_createCall } from "react-call-return";
import {
  FaCarAlt,
  FaBed,
  FaPlane,
  FaSpaceShuttle,
  FaPlay,
  FaPause,
  FaForward,
  FaBackward
} from "react-icons/fa";

import "./04.css";

const cars = (
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
);

const hotels = (
  <div>
    <h2>Hotels</h2>
    <p>
      The best hotels at the best price. Whether you're looking for a romantic
      get-away or just need a place to crash that offers free breakfast and a
      hot tub, we have the best hotels around.
    </p>
  </div>
);
const flights = (
  <div>
    <h2>Flights</h2>
    <p>
      Cheap fare and great flights. We have the most non-stop from major cities
      across the world than anybody else.
    </p>
  </div>
);
const space = (
  <div>
    <h2>Space</h2>
    <p>
      Sometimes when I watch shows like Passengers, and they're experiencing
      intergallactic travel, slingshotting around a star and gazing at it out
      the window, or standing outside the ship staring into the universe, I get
      actually angry that I won't experience it. Time to find a religion that
      believes we can create worlds and travel from one to the other.
    </p>
  </div>
);

/** 
class Tabs extends React.Component {
  state = {
    activeIndex: 0
  };

  selectTabIndex = activeIndex => this.setState({ activeIndex });
  render() {
    const { data } = this.props;
    return (
      <div className="Tabs">
        <div className="tabs">
          {data.map((tab, index) => {
            const isActive = this.state.activeIndex === index;
            return (
              <div
                key={index}
                className={isActive ? "tab active" : "tab"}
                onClick={() => this.selectTabIndex(index)}
              >
                {tab.label}
              </div>
            );
          })}
        </div>
        <div className="panels">{data[this.state.activeIndex].content}</div>
      </div>
    );
  }
}
*/

class Tabs extends React.Component {
  state = { activeIndex: 0 };
  selectTabIndex = activeIndex => {
    this.setState({ activeIndex });
  };
  render() {
    const children = React.Children.map(this.props.children, (child, index) => {
      return React.cloneElement(child, {
        activeIndex: this.state.activeIndex,
        onSelectTab: this.selectTabIndex
      });
    });

    return <div className="Tabs">{children}</div>;
  }
}

class TabList extends React.Component {
  render() {
    const { activeIndex } = this.props;
    const children = React.Children.map(this.props.children, (child, index) => {
      return React.cloneElement(child, {
        isActive: index === activeIndex,
        onSelect: () => this.props.onSelectTab(index)
      });
    });
    return <div className="tabs">{children}</div>;
  }
}

class Tab extends React.Component {
  render() {
    const { isActive, isDisabled, onSelect } = this.props;
    return (
      <div
        className={isActive ? "tab active" : "tab"}
        onClick={isDisabled ? null : onSelect}
      >
        {this.props.children}
      </div>
    );
  }
}

class TabPanels extends React.Component {
  render() {
    const { activeIndex, children } = this.props;
    return <div className="panels">{children[activeIndex]}</div>;
  }
}

class TabPanel extends React.Component {
  render() {
    return this.props.children;
  }
}

class DataTabs extends React.Component {
  render() {
    const { data } = this.props;
    return (
      <Tabs>
        <TabList>
          {data.map((tab, index) => (
            <Tab key={index}>{tab.label}</Tab>
          ))}
        </TabList>
        <TabPanels>
          {data.map((tab, index) => (
            <TabPanel key={index}>{tab.content}</TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    );
  }
}

class App1 extends React.Component {
  render() {
    const tabData = [
      {
        label: <FaCarAlt />,
        content: cars
      },
      {
        label: <FaBed />,
        content: hotels
      },
      {
        label: <FaPlane />,
        content: flights
      },
      {
        label: <FaSpaceShuttle />,
        content: space
      }
    ];
    return (
      <div className="App">
        <DataTabs data={tabData} />
      </div>
    );
  }
}

//Future
class RadioGroupFuture extends Component {
  state = {
    value: this.props.defaultValue
  };

  render() {
    const { children } = this.props;
    return (
      <fieldset className="radio-group">
        <legend>{this.props.legend}</legend>
        {unstable_createCall(children, (props, returns) =>
          returns.map(item =>
            item.render({
              isActive: item.value === this.state.value,
              onSelect: () => this.setState({ value: item.value })
            })
          )
        )}
      </fieldset>
    );
  }
}

class RadioButtonFuture extends Component {
  render() {
    return unstable_createReturn({
      value: this.props.value,
      render: ({ isActive, onSelect }) => {
        const className = "radio-button " + (isActive ? "active" : "");
        return (
          <button className={className} onClick={onSelect}>
            {this.props.children}
          </button>
        );
      }
    });
  }
}

const BackwardButtonFuture = () => (
  <RadioButtonFuture value="back">
    <FaBackward />
  </RadioButtonFuture>
);

class App2 extends Component {
  render() {
    return (
      <div>
        <RadioGroupFuture defaultValue="pause" legend="Radio Group">
          <BackwardButtonFuture />
          <RadioButtonFuture value="play">
            <FaPlay />
          </RadioButtonFuture>
          <RadioButtonFuture value="pause">
            <FaPause />
          </RadioButtonFuture>
          <RadioButtonFuture value="forward">
            <FaForward />
          </RadioButtonFuture>
        </RadioGroupFuture>
      </div>
    );
  }
}

//exercise

class RadioGroup extends React.Component {
  state = {
    value: this.props.defaultValue
  };
  render() {
    const children = React.Children.map(this.props.children, (child, index) => {
      return React.cloneElement(child, {
        isActive: child.props.value === this.state.value,
        onSelect: () => this.setState({ value: child.props.value })
      });
    });
    return (
      <fieldset className="radio-group">
        <legend>{this.props.legend}</legend>
        {children}
      </fieldset>
    );
  }
}

class RadioButton extends React.Component {
  render() {
    const { isActive, onSelect } = this.props;
    const className = isActive ? `radio-button  active` : "radio-button ";
    return (
      <button onClick={onSelect} className={className}>
        {this.props.children}
      </button>
    );
  }
}

class App3 extends React.Component {
  render() {
    return (
      <div>
        <RadioGroup defaultValue="pause" legend="radio group">
          <RadioButton value="back">
            <FaBackward />
          </RadioButton>
          <RadioButton value="play">
            <FaPlay />
          </RadioButton>
          <RadioButton value="pause">
            <FaPause />
          </RadioButton>
          <RadioButton value="forward">
            <FaForward />
          </RadioButton>
        </RadioGroup>
      </div>
    );
  }
}

// app

const App = () => (
  <div>
    <App1 />
    <hr />
    {/* <App2 /> */}
    <hr />
    <App3 />
  </div>
);

export default App;

App.title = "tabs";
