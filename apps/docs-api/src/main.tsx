import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ApiReferenceReact } from "@scalar/api-reference-react";
import "@scalar/api-reference-react/style.css";
import spec from "@grovine/docs-openapi/openapi.yaml?raw";

createRoot(document.querySelector("#app")!).render(
  <StrictMode>
    <ApiReferenceReact
      configuration={{
        spec: {
          content: spec,
        },
      }}
    />
  </StrictMode>,
);
