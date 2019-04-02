import React from "react";
import "./09.css";
import { createBrowserHistory } from "history";
//MiniRouter

const RouterContext = React.createContext();

class MiniRouter extends React.Component {
  history = createBrowserHistory();

  componentDidMount() {
    this.unsubscribe = this.history.listen(() => {
      this.forceUpdate();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    return (
      <RouterContext.Provider value={{ history: this.history }}>
        {this.props.children}
      </RouterContext.Provider>
    );
  }
}

class MiniRoute extends React.Component {
  render() {
    return (
      <RouterContext.Consumer>
        {context => {
          const { path, exact, render, component: ReactComponent } = this.props;
          const { location } = context.history;
          const match = exact
            ? location.pathname === path
            : location.pathname.startsWith(path);
          if (match) {
            if (render) {
              return render();
            } else if (ReactComponent) {
              return <ReactComponent />;
            } else {
              return null;
            }
          } else {
            return null;
          }
        }}
      </RouterContext.Consumer>
      // <RouterContext.Consumer>
      //   {context => {
      //     const { path, exact, render, component: Component } = this.props;
      //     const { location } = context.history;
      //     return <div>dsa</div>;
      //     const match = exact
      //       ? location.pathname === path
      //       : location.pathname.startsWith(path);
      //     if (match) {
      //       if (render) {
      //         return render();
      //       } else if (Component) {
      //         return <Component />;
      //       } else {
      //         return null;
      //       }
      //     } else {
      //       return null;
      //     }
      //   }}
      //   }
      // </RouterContext.Consumer>
    );
  }
}

class Link extends React.Component {
  render() {
    return (
      <RouterContext.Consumer>
        {context => {
          const handleClick = e => {
            e.preventDefault();
            context.history.push(this.props.to);
          };
          return (
            <a href={`${this.props.to}`} onClick={handleClick}>
              {this.props.children}
            </a>
          );
        }}
      </RouterContext.Consumer>
    );
  }
}

//App

const Dashboard = () => (
  <div>
    <h2>Dashboard</h2>
  </div>
);

const About = () => (
  <div>
    <h2>About</h2>
  </div>
);

const Topics = ({ match }) => (
  <div>
    <h2>Topics</h2>
    <ul>
      <li>Rendering with React</li>
      <li>Components</li>
      <li>Props v. State</li>
    </ul>
  </div>
);

const RouterApp = () => (
  <MiniRouter>
    <div>
      <ul>
        <li>
          <Link to="/08/home">Home</Link>
        </li>
        <li>
          <Link to="/08/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link to="/08/about">About</Link>
        </li>
        <li>
          <Link to="/08/topics">Topics</Link>
        </li>
        <li>
          <Link to="/08/home/1">home-1</Link>
        </li>
      </ul>

      <hr />

      <MiniRoute path="/08/dashboard" component={Dashboard} />
      <MiniRoute path="/08/about" component={About} />
      <MiniRoute path="/08/topics" component={Topics} />
      <MiniRoute
        exact
        path="/08/home"
        render={() => (
          <div>
            <h2>Home</h2>
          </div>
        )}
      />
      {/* 
     
     
       */}
    </div>
  </MiniRouter>
);

RouterApp.title = "mini router";

export default RouterApp;
