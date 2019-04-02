import React, { createContext, Component } from "react";
import pathToRegexp from "path-to-regexp";
// context
const { Provider, Consumer } = createContext();

//HashRouter
class HashRouter extends Component {
  state = {
    location: {
      state: {},
      pathname: window.location.hash.slice(1) || "/"
    },
    history: {
      push: path => this.handlePush(path)
    }
  };

  handlePush = path => {
    if (typeof path === "object") {
      let { pathname, state } = path;

      this.setState(
        {
          location: { pathname, state }
        },
        () => (window.location.hash = pathname)
      );
    } else {
      this.setState(
        {
          location: {
            ...this.state.location,
            pathname: path
          }
        },
        () => {
          window.location.hash = path;
        }
      );
    }
  };

  render() {
    return <Provider value={this.state}>{this.props.children}</Provider>;
  }
}

// Route
class Route extends Component {
  constructor(props) {
    super(props);
    const { path, exact = false } = props;
    this.keys = [];
  }

  render() {
    return (
      <Consumer>
        {context => {
          let {
            path,
            component: Comp,
            render,
            children,
            exact = false
          } = this.props;
          console.log(context.location.state, "login");
          let regexp = pathToRegexp(path, this.keys, { end: exact });
          let { location } = context;
          let result = location.pathname.match(regexp);
          let props = { location, history: context.history };
          if (result) {
            let [url, ...values] = result;
            props.match = {
              url, // '/user/name/1/khalil'
              path, // '/user/name/:id/:name'
              params: this.keys
                .map(key => key.name)
                .reduce((acc, key, idx) => {
                  acc[key] = values[idx];
                  return acc;
                }, {})
            };
            if (Comp) {
              return <Comp {...props} />;
            } else if (render) {
              return render(props);
            } else if (children) {
              return children(props);
            } else {
              return null;
            }
          } else {
            if (children) {
              return children(props);
            } else {
              return null;
            }
          }
        }}
      </Consumer>
    );
  }
}

// Link.js
class Link extends Component {
  render() {
    return (
      <Consumer>
        {context => {
          return (
            <a onClick={() => context.history.push(this.props.to)}>
              {this.props.children}
            </a>
          );
        }}
      </Consumer>
    );
  }
}

// Switch.js
class Switch extends Component {
  render() {
    return (
      <Consumer>
        {context => {
          let {
            location: { pathname }
          } = context;

          let { children } = this.props;
          let child;
          for (let i = 0; i < children.length; i++) {
            let childComp = children[i];
            let { path = "" } = childComp.props;
            if (pathToRegexp(path, [], { end: false }).test(pathname)) {
              child = childComp;
              break;
            }
            child = null;
          }
          return child;
        }}
      </Consumer>
    );
  }
}

// Redirect.js
class Redirect extends Component {
  render() {
    return (
      <Consumer>
        {context => {
          context.history.push(this.props.to);
          return null;
        }}
      </Consumer>
    );
  }
}

//App
class Nav extends Component {
  render() {
    return (
      <HashRouter>
        <div className="container">
          <nav className="navbar navbar-default">
            <div className="container-fluid">
              <div className="navbar-header">
                <div className="navbar-brand">管理系统</div>
              </div>
              <ul className="nav navbar-nav">
                <Link to="/home">首页</Link>
                <Link to="/user">用户管理</Link>
                <Link to="/login">登录</Link>
                <Link to="/profile">个人设置</Link>
              </ul>
            </div>
          </nav>
          <div className="row">
            <div className="col-md-12">{this.props.children}</div>
          </div>
        </div>
      </HashRouter>
    );
  }
}

// const MenuLink = ({ to, children }) => {
//   return (
//     <Route
//       path={to}
//       children={props => (
//         <li className={props.match ? "xxx" : ""}>
//           <Link to={to}>{children}</Link>
//         </li>
//       )}
//     />
//   );
// };

class Login extends Component {
  handleClick = () => {
    localStorage.setItem("login", true);
    this.props.history.push(this.props.location.state.from);
  };
  render() {
    const isLogined = localStorage.getItem("login");
    return (
      <div>
        {!isLogined ? (
          <button
            onClick={this.handleClick}
            style={{
              color: "black",
              background: "#ccc",
              width: "100px",
              height: "100px"
            }}
          >
            登录
          </button>
        ) : (
          <p>has already login</p>
        )}
      </div>
    );
  }
}

//User.js
class User extends Component {
  render() {
    return (
      <div className="row">
        <div className="col-md-2">
          <ul className="nav nav-pills nav-stacked">
            <li>
              <Link to="/user/add">添加用户</Link>
            </li>
            <li>
              <Link to="/user/list">用户列表</Link>
            </li>
          </ul>
        </div>
        <div className="col-md-10">
          <Route path="/user/add" component={UserAdd} />
          <Route path="/user/list" component={UserList} />
          <Route path="/user/detail/:id" component={UserDetail} />
        </div>
      </div>
    );
  }
}

//UserAdd.js
class UserAdd extends Component {
  hanldeSubmit = e => {
    e.preventDefault();
    let username = this.username.value;
    let user = { id: Date.now(), username };
    let userStr = localStorage.getItem("users");
    let users = userStr ? JSON.parse(userStr) : [];
    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));
    this.props.history.push("/user/list");
  };
  render() {
    return (
      <form onSubmit={this.hanldeSubmit}>
        <div className="form-gorup">
          <label>用户名</label>
          <input
            ref={input => (this.username = input)}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <input type="submit" className="btn btn-primary" value="提交" />
        </div>
      </form>
    );
  }
}

//UserList
class UserList extends Component {
  constructor(props) {
    super(props);
    this.state = { users: [] };
  }
  componentDidMount() {
    let usersStr = localStorage.getItem("users");
    let users = usersStr ? JSON.parse(usersStr) : [];
    this.setState({ users });
  }
  render() {
    return (
      <ul className="list-group">
        {this.state.users.map((user, index) => (
          <li key={index} className="list-group-item">
            <Link to={"/user/detail/" + user.id}>{user.username}</Link>
          </li>
        ))}
      </ul>
    );
  }
}

// UserDetails
class UserDetail extends Component {
  constructor(props) {
    super(props);
    this.state = { user: {} };
  }
  componentDidMount() {
    let usersStr = localStorage.getItem("users");
    let users = usersStr ? JSON.parse(usersStr) : [];
    let user = users.find(user => user.id == this.props.match.params.id);
    this.setState({ user });
  }

  render() {
    return (
      <div>
        {this.state.user.id}:{this.state.user.username}
      </div>
    );
  }
}

//Proteceted
const Protected = ({ component: Comp, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props =>
        localStorage.getItem("login") ? (
          <Comp {...props} />
        ) : (
          // <h1>{props.location.pathname}</h1>
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location.pathname }
            }}
          />
        )
      }
    />
  );
};

// MainApp

let Home = props => <h1>首页</h1>;
let Profile = props => <h1>个人设置</h1>;

const MainApp = () => (
  <Nav>
    <Switch>
      <Route path="/home" component={Home} />
      <Route path="/user" component={User} />
      <Route path="/login" component={Login} />
      <Protected path="/profile" component={Profile} />
    </Switch>
  </Nav>
);

// export app;
const App = () => (
  <div>
    <HashRouter>
      <MainApp />
    </HashRouter>
  </div>
);

App.title = "hashRouter";

export default App;
