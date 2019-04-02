import React from "react";
import ReactDOM from "react-dom";
import { Router, Link } from "@reach/router";
import { jsx, css } from "@emotion/core";

import "./styles.css";

const files = [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12"
];

const pages = files.reduce((p, filename, index, fullArray) => {
  const example = require(`./examples/${filename}`);
  Object.assign(example, {
    previous: fullArray[index - 1],
    next: fullArray[index + 1]
  });
  p[filename] = {
    example,
    title: example.default.title
  };
  return p;
}, {});

console.log(pages);

const filesAndTitles = files.map(filename => ({
  title: pages[filename].title,
  filename
}));

class ErrorCatcher extends React.Component {
  static getDerivedStateFromProps() {
    return { error: null };
  }
  state = { error: null };
  componentDidCatch(error, info) {
    console.log(error, info);
    this.setState({ error });
  }

  render() {
    const { error } = this.state;
    const { children, ...props } = this.props;

    return (
      <div {...props}>
        {error ? "There was an error. Edit the code and try again." : children}
      </div>
    );
  }
}

function ComponentContainer({ label, ...props }) {
  return (
    <div>
      <h3 style={{ textAlign: "center" }}>{label}</h3>
      <ErrorCatcher {...props} />
    </div>
  );
}

function Home() {
  return (
    <div>
      <h1 style={{ textAlign: "center" }}> React Spring Examples</h1>
      <div>
        {filesAndTitles.map(({ title, filename }) => {
          return (
            <div key={filename} style={{ margin: 10 }}>
              {filename}
              {".  "}
              <Link to={`/${filename}`}>{title}</Link>
              {"  "}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ExampleContainer({ exampleId }) {
  const {
    example: { default: Example }
  } = pages[exampleId];

  return (
    <div
      style={{
        padding: 20,
        height: "100%",
        display: "flex",
        flexDirection: "column"
      }}
    >
      <h1 style={{ textAlign: "center" }} />
      <NavigationFooter exampleId={exampleId} type="page" />
      <ComponentContainer
        label={<Link to={`/`}>{pages[exampleId].title}</Link>}
      >
        <Example />
      </ComponentContainer>
    </div>
  );
}

function NavigationFooter({ exampleId, type }) {
  const current = pages[exampleId];
  let Usage = current.example;
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        width: "100%",
        backgroundColor: "#eee",
        position: "sticky",
        top: "0px",
        padding: "20px 20px"
      }}
    >
      <div style={{ flex: 1, textAlign: "left" }}>
        {Usage.previous ? (
          <Link to={`/${Usage.previous}`}>
            {pages[Usage.previous].title}
            {"  "}
            <span role="img" aria-label="previous">
              👈
            </span>
          </Link>
        ) : null}
      </div>
      <div style={{ flex: 1, textAlign: "center" }}>
        <Link to="/">🥳Home🥳</Link>
      </div>
      <div style={{ flex: 1, textAlign: "right" }}>
        {Usage.next ? (
          <Link to={`/${Usage.next}`}>
            {pages[Usage.next].title}
            {"  "}
            <span role="img" aria-label="next">
              👉
            </span>
          </Link>
        ) : null}
      </div>
    </div>
  );
}

console.log(pages[1]);

function App() {
  return (
    <React.Suspense>
      <Router>
        <Home path="/" />
        <ExampleContainer path="/:exampleId" />
      </Router>
    </React.Suspense>
  );
}

export { App };
