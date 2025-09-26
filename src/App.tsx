import React from "react";
import "./App.scss";
import { Button } from "./shared/components/button/Button";
import { PenBox } from "lucide-react";

function App() {
  return (
    <div
      style={{
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      <Button variant={"primary"} size="md">
        Button
      </Button>
      <Button
        variant={"ghost"}
        size="sm"
        leadingIcon={<PenBox />}
        type="icon-only"
        aria-label="Edit"
      />
    </div>
  );
}

export default App;
