import * as NodePath from "node:path";
import { fileURLToPath } from "node:url";
import { plugin } from "./plugin.mjs";

const __dirname = NodePath.dirname(fileURLToPath(import.meta.url));

export default function getWebpackConfig({
  WEBPACK_BUNDLE,
  WEBPACK_SERVE,
  WEBPACK_WATCH,
}) {
  const isRunningWebpack = WEBPACK_BUNDLE || WEBPACK_SERVE || WEBPACK_WATCH;
  /**
   * @type {import('webpack').Configuration | import('@rspack/cli').Configuration}
   */
  const config = {
    mode: "development",
    devtool: false,
    context: NodePath.resolve(__dirname, "src"),
    entry: "./index",
    plugins: [plugin],
    output: {
      clean: true,
      path: isRunningWebpack
        ? NodePath.resolve(__dirname, "dist/webpack")
        : NodePath.resolve(__dirname, "dist/rspack"),
    },
  };

  return config;
}
