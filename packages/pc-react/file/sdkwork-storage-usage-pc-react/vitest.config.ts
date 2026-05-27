import path from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(packageRoot, "../../../../");
const appbaseNodeModules = path.join(workspaceRoot, "sdkwork-appbase/node_modules");

export default {
  resolve: {
    alias: {
      "@testing-library/react": path.join(appbaseNodeModules, "@testing-library/react"),
      react: path.join(appbaseNodeModules, "react"),
      "react-dom": path.join(appbaseNodeModules, "react-dom"),
      "react/jsx-runtime": path.join(appbaseNodeModules, "react/jsx-runtime.js"),
    },
  },
  test: {
    environment: "jsdom",
  },
};
