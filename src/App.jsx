import * as React from "react";
import axios from "axios";

export default function App(props) {
  const [data, setData] = React.useState(props.data);
  const [type, setType] = React.useState(props.type);

  const loadApi = async (type, id) => {
    try {
      let path = `https://swapi.dev/api/${type}`;
      if (id) {
        path = `${path}/${id}`;
      }
      const response = await axios.get(path);
      const apiData = response.data;
      setData(apiData);
    } catch (e) {}
  };

  React.useEffect(() => {
    const type = window.location.pathname.split("/")[1];
    const id = window.location.pathname.split("/")[2];

    if (!type) {
      return;
    }
    setType(type);
    loadApi(type, id);
  }, [setType]);

  if (!type) {
    return (
      <div>
        <h1>Home</h1>
        <ul>
          <li>
            <a href="people/1">/people/1</a>
          </li>
          <li>
            <a href="planets/3">/planets/3</a>
          </li>
          <li>
            <a href="starships/9">/starships/9</a>
          </li>
        </ul>
      </div>
    );
  }

  return (
    <div>
      <h1>{type}</h1>
      {!data ? (
        <div>Loading</div>
      ) : (
        <pre>
          <code>{JSON.stringify(data, null, 4)}</code>
        </pre>
      )}
    </div>
  );
}
