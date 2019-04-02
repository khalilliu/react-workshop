import React from "react";
import { FaCar, FaBed, FaPlane, FaSpaceShuttle } from "react-icons/fa";
import "./10.css";
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

class Tabs extends React.Component {
  state = {
    activeIndex: this.props.defaultActiveIndex || 0
  };

  isControlled = () => {
    return this.props.activeIndex !== null;
  };

  selectTabIndex = index => {
    this.props.onChange(index);
    // not controlled
    if (!this.isControlled()) {
      this.setState({ activeIndex: index });
    }
  };

  render() {
    const children = React.Children.map(this.props.children, (child, index) => {
      return React.cloneElement(child, {
        activeIndex: this.isControlled()
          ? this.props.activeIndex
          : this.state.activeIndex,
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
        isActive: activeIndex === index,
        onSelect: () => this.props.onSelectTab(index)
      });
    });

    return <div className="tabs">{children}</div>;
  }
}

class Tab extends React.Component {
  render() {
    const { isDisabled, isActive, onSelect } = this.props;
    return (
      <div
        onClick={isDisabled ? null : onSelect}
        className={
          isDisabled ? "tab disabled" : isActive ? "tab active" : "tab"
        }
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

const COLORS = ["red", "blue", "green", "yellow"];

class App extends React.Component {
  state = { currentTab: 0 };
  render() {
    const { currentTab } = this.state;
    const color = COLORS[currentTab];
    return (
      <div className={`App ${color}-bg`}>
        <Tabs
          onChange={index => this.setState({ currentTab: index })}
          activeIndex={this.state.currentTab}
        >
          <TabList>
            <Tab>
              <FaCar className={currentTab === 0 ? COLORS[currentTab] : ""} />
            </Tab>
            <Tab>
              <FaBed className={currentTab === 1 ? COLORS[currentTab] : ""} />
            </Tab>
            <Tab>
              <FaPlane className={currentTab === 2 ? COLORS[currentTab] : ""} />
            </Tab>
            <Tab>
              <FaSpaceShuttle
                className={currentTab === 3 ? COLORS[currentTab] : ""}
              />
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>{text.cars}</TabPanel>
            <TabPanel>{text.hotels}</TabPanel>
            <TabPanel>{text.flights}</TabPanel>
            <TabPanel>{text.space}</TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    );
  }
}

// exercise
class Select extends React.Component {
  state = {
    value: this.props.defaultValue,
    isOpen: false
  };

  handleToggle = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  };

  isControlled() {
    return this.props.value !== undefined;
  }

  render() {
    const { isOpen } = this.state;
    let label;
    const children = React.Children.map(this.props.children, (child, index) => {
      const { value } = this.isControlled() ? this.props : this.state;
      if (child.props.value === value) {
        label = child.props.children;
      }
      return React.cloneElement(child, {
        onSelect: () => {
          if (this.isControlled()) {
            this.props.onChange(child.props.value);
          } else {
            this.setState({ value: child.props.value });
          }
        }
      });
    });
    return (
      <div onClick={this.handleToggle} className="select">
        <button className="label2">
          {label} <span className="arrow">▾</span>
        </button>
        {isOpen && <ul className="options">{children}</ul>}
      </div>
    );
  }
}

class Option extends React.Component {
  render() {
    return (
      <li className="option" onClick={this.props.onSelect}>
        {this.props.children}
      </li>
    );
  }
}

class App2 extends React.Component {
  state = { selectValue: "dosa" };
  setToMintChutney = () => {
    this.setState({
      selectValue: "mint-chutney"
    });
  };
  render() {
    return (
      <div className="app-10">
        <div className="block">
          <h2>Uncontrolled</h2>
          <Select defaultValue="tikka-masala">
            <Option value="tikka-masala">Tikka Masala</Option>
            <Option value="tandoori-chicken">Tandoori Chicken</Option>
            <Option value="dosa">Dosa</Option>
            <Option value="mint-chutney">Mint Chutney</Option>
          </Select>
        </div>

        <div className="block">
          <h2>Controlled</h2>
          <p>
            <button onClick={this.setToMintChutney}>Set to Mint Chutney</button>
          </p>
          <Select
            value={this.state.selectValue}
            onChange={selectValue => {
              this.setState({ selectValue });
            }}
          >
            <Option value="tikka-masala">Tikka Masala</Option>
            <Option value="tandoori-chicken">Tandoori Chicken</Option>
            <Option value="dosa">Dosa</Option>
            <Option value="mint-chutney">Mint Chutney</Option>
          </Select>
        </div>
      </div>
    );
  }
}

const MainApp = () => (
  <div>
    <App />
    <App2 />
  </div>
);

MainApp.title = "controlled props ";

export default MainApp;
