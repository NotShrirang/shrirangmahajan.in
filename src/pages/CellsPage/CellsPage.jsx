import React, { useState } from "react";
import styles from "./CellsPage.module.css";
import Cell from "../../components/Cell/Cell";

const CellsPage = () => {
  const [activeCell, setActiveCell] = useState(1);
  return (
    <div className={styles.cellsPage}>
      <div className={styles.cellsContainer}>
        <Cell
          cell={{
            id: 1,
            content: "print('Hello World')\nprint('Hello World')",
          }}
          activeCell={activeCell}
          setActiveCell={setActiveCell}
        />
        <Cell
          cell={{
            id: 2,
            content: "print('Hello World')\nprint('Hello World')",
          }}
          activeCell={activeCell}
          setActiveCell={setActiveCell}
        />
      </div>
    </div>
  );
};

export default CellsPage;
