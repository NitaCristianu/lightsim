import { useState } from "react";
import Properties from "./components/properties";
import Room from "./components/room";
import Corner from "./utils/corner";
import { Page } from './components/page'

function App() {
  const [page, setPage] = useState(true);

  return (
    <div
      style={{
        overflow: "unset"
      }}
    >
      {page ? <>
        <Room
          name="naztravan"
        />
        <Properties />
        <Corner />
      </>
        : <Page />}
    </div>
  );
}

export default App;
