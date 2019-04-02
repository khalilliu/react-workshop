import React, { createContext } from "react";
import { createStore, combineReducers, bindActionCreators } from "redux";
import classnames from "classnames";
// mini react-redux
const ReduxContext = createContext();
class Provider extends React.Component {
  render() {
    return (
      <ReduxContext.Provider value={{ store: this.props.store }}>
        {this.props.children}
      </ReduxContext.Provider>
    );
  }
}

const connect = (mapStateToProps, mapDispatchToProps) => Comp =>
  class Conn extends React.Component {
    static contextType = ReduxContext;
    componentDidMount() {
      this.unsubscribe = this.context.store.subscribe(() => {
        this.forceUpdate();
      });
    }
    componentWillUnmount() {
      this.unsubscribe();
    }
    render() {
      return (
        <Comp
          {...mapStateToProps(this.context.store.getState())}
          {...mapDispatchToProps(this.context.store.dispatch)}
        />
      );
    }
  };

// actionTypes
const actionTypes = {
  ADD_TODO: "ADD_TODO",
  DELETE_TODO: "DELETE_TODO",
  EDIT_TODO: "EDIT_TODO",
  COMPLETE_TODO: "COMPLETE_TODO",
  COMPLETE_ALL: "COMPLETE_ALL",
  CLEAR_COMPLETED: "CLEAR_COMPLETED"
};

const todoFilters = {
  SHOW_ALL: "SHOW_ALL",
  SHOW_ACTIVE: "SHOW_ACTIVE",
  SHOW_COMPLETED: "SHOW_COMPLETED"
};

const filterTitles = {
  SHOW_ALL: "All",
  SHOW_ACTIVE: "Active",
  SHOW_COMPLETED: "Completed"
};

// reducers
const initialState = [
  {
    text: "Implement React Redux",
    completed: false,
    id: 0
  }
];

function todos(state = initialState, action) {
  switch (action.type) {
    case actionTypes.ADD_TODO:
      return [
        {
          id:
            state.reduce((maxId, todo) => {
              return Math.max(maxId, todo.id);
            }, -1) + 1,
          completed: false,
          text: action.text
        },
        ...state
      ];
    case actionTypes.DELETE_TODO:
      return state.filter(todo => todo.id !== action.id);
    case actionTypes.EDIT_TODO:
      return state.map(todo =>
        todo.id === action.id ? { ...todo, text: action.text } : todo
      );
    case actionTypes.COMPLETE_TODO:
      return state.map(todo =>
        todo.id === action.id ? { ...todo, completed: !todo.completed } : todo
      );
    case actionTypes.COMPLETE_ALL:
      const areAllMarked = state.every(todo => todo.completed);
      return state.map(todo => ({
        ...todo,
        completed: !areAllMarked
      }));
    case actionTypes.CLEAR_COMPLETED:
      return state.filter(todo => todo.completed === false);
    default:
      return state;
  }
}

//rootReducer
const rootReducer = combineReducers({ todos });

// initial store

const store = createStore(rootReducer);

// actions
const TodoActions = {
  addTodo: text => ({ text, type: actionTypes.ADD_TODO }),
  deleteTodo: id => ({ id, type: actionTypes.DELETE_TODO }),
  editTodo: (id, text) => ({ id, text, type: actionTypes.EDIT_TODO }),
  completeTodo: id => ({ type: actionTypes.COMPLETE_TODO, id }),
  completeAll: () => ({ type: actionTypes.COMPLETE_ALL }),
  clearCompleted: () => ({ type: actionTypes.CLEAR_COMPLETED })
};

// todoFilters
const TodoFilters = {
  SHOW_ALL: () => true,
  SHOW_ACTIVE: todo => !todo.completed,
  SHOW_COMPLETED: todo => todo.completed
};

// components
class Header extends React.Component {
  handleSave = text => {
    if (text.trim().length !== 0) {
      this.props.addTodo(text);
    }
  };

  render() {
    return (
      <header className="header">
        <h1>Todos</h1>
        <TodoTextInput
          newTodo
          onSave={this.handleSave}
          placeholder="What needs to be done?"
        />
      </header>
    );
  }
}

class Footer extends React.Component {
  renderTodoCount() {
    const { activeCount } = this.props;
    const itemWord = activeCount === 1 ? "item" : "items";
    return (
      <span>
        <strong>{activeCount || "No"}</strong>
        {itemWord}
      </span>
    );
  }

  renderFilterLink(filter) {
    const title = filterTitles[filter];
    const { filter: selectedFilter, onShow } = this.props;
    return (
      <a
        style={{ cursor: "pointer" }}
        onClick={() => onShow(filter)}
        className={classnames({ selected: filter === selectedFilter })}
      >
        {title}
      </a>
    );
  }

  renderClearButton() {
    const { completedCount, onClearCompleted } = this.props;
    if (completedCount > 0) {
      return (
        <button className="clear-completed" onClick={onClearCompleted}>
          Clear Completed
        </button>
      );
    }
  }

  render() {
    return (
      <footer className="footer">
        {this.renderTodoCount()}
        <ul className="filters">
          {Object.keys(todoFilters).map(filter => (
            <li key={filter}>{this.renderFilterLink(filter)}</li>
          ))}
        </ul>
        {this.renderClearButton()}
      </footer>
    );
  }
}

class TodoItem extends React.Component {
  state = { editing: false };

  handleDoubleClick = e => {
    this.setState({ editing: true });
  };

  handleSave = (id, text) => {
    if (text.length === 0) {
      this.props.deleteTodo(id);
    } else {
      this.props.editTodo(id, text);
    }
    this.setState({ editing: false });
  };
  render() {
    const { todo, completeTodo, deleteTodo } = this.props;
    let element;
    if (this.state.editing) {
      element = (
        <div className="view">
          <TodoTextInput
            hasButton
            text={todo.text}
            editing={this.state.editing}
            onSave={text => this.handleSave(todo.id, text)}
          />
        </div>
      );
    } else {
      element = (
        <div className="view">
          <input
            className="toggle"
            type="checkbox"
            checked={todo.completed}
            onChange={e => completeTodo(todo.id)}
          />
          <label onDoubleClick={this.handleDoubleClick}>{todo.text}</label>
          <button className="destroy" onClick={() => deleteTodo(todo.id)}>
            X
          </button>
        </div>
      );
    }
    return (
      <li
        className={classnames({
          completed: todo.completed,
          editing: this.state.editing
        })}
      >
        {element}
      </li>
    );
  }
}

class TodoTextInput extends React.Component {
  state = { text: this.props.text || "" };

  handleChange = e => this.setState({ text: e.target.value.trim() });
  handleBlur = e => {
    if (!this.props.newTodo) {
      this.props.onSave(this.state.text);
    }
  };
  handleSubmit = e => {
    console.log(e.which === 13);

    const text = e.target.value.trim();

    if (e.which === 13) {
      this.props.onSave(text);
      if (this.props.newTodo) {
        this.setState({ text: "" });
      }
    }
  };
  render() {
    return (
      <>
        <input
          ref={n => (this.node = n)}
          className={classnames({
            edit: this.props.editing,
            "new-todo": this.props.newTodo
          })}
          type="text"
          placeholder={this.props.placeholder}
          audoFocus
          value={this.state.text}
          onBlur={this.handleBlur}
          onChange={this.handleChange}
          onKeyDown={this.handleSubmit}
        />
        {this.props.hasButton && (
          <button onClick={this.handleBlur}>Save</button>
        )}
      </>
    );
  }
}

class MainSection extends React.Component {
  state = {
    filter: todoFilters.SHOW_ALL
  };

  renderToggleAll(completedCount) {
    const { todos, actions } = this.props;
    if (todos.length > 0) {
      return (
        <>
          <input
            className="toggle-all"
            type="checkbox"
            checked={completedCount === todos.length}
            onChange={actions.completeAll}
          />
          <label>toggle all</label>
        </>
      );
    }
  }

  handleClearCompleted = () => {
    this.props.actions.clearCompleted();
  };

  handleShow = filter => {
    this.setState({ filter });
  };

  renderFooter(completedCount) {
    const { todos } = this.props;
    const { filter } = this.state;
    const activeCount = todos.length - completedCount;

    if (todos.length) {
      return (
        <Footer
          completedCount={completedCount}
          activeCount={activeCount}
          filter={filter}
          onClearCompleted={this.handleClearCompleted}
          onShow={this.handleShow}
        />
      );
    }
  }

  render() {
    const { todos, actions } = this.props;
    const { filter } = this.state;
    const filteredTodos = todos.filter(TodoFilters[filter]);
    const completedCount = todos.reduce(
      (count, todo) => (todo.completed ? count + 1 : count),
      0
    );

    return (
      <section className="main">
        {this.renderToggleAll(completedCount)}
        <ul className="todo-list">
          {filteredTodos.map(todo => (
            <TodoItem key={todo.id} todo={todo} {...actions} />
          ))}
        </ul>
        {this.renderFooter(completedCount)}
      </section>
    );
  }
}

// container

const mapStateToProps = state => ({ todos: state.todos });
const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(TodoActions, dispatch)
});
const App = connect(
  mapStateToProps,
  mapDispatchToProps
)(({ todos, actions }) => (
  <div>
    <Header addTodo={actions.addTodo} />
    <MainSection todos={todos} actions={actions} />
  </div>
));

const Test1 = connect(
  mapStateToProps,
  mapDispatchToProps
)(({ actions, todos }) => {
  return <div>{todos[0].text}</div>;
});

// main app
const MainApp = () => (
  <Provider store={store}>
    {/* <Test1 /> */}
    <App />
  </Provider>
);

MainApp.title = "mini react-redux";

export default MainApp;
