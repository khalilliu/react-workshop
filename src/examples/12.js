import React from "react";

const Counter = () => {
  const [count, setCount] = React.useState(0);
  const [loading, setLoading] = React.useState(true);

  const ref = React.useRef(count);

  const fetch = React.useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setCount(1);
      setLoading(false);
    }, 2000);
  }, []);
  React.useEffect(
    () => {
      fetch();
    },
    [fetch]
  );

  return (
    <div>
      {!loading ? (
        <div>
          Count: {count}
          <button onClick={() => setCount(pre => pre + 1)}>+</button>
          <button onClick={() => setCount(pre => pre - 1)}>-</button>
        </div>
      ) : (
        <div>loading</div>
      )}
    </div>
  );
};

Counter.title = "Counter";

export default Counter;
