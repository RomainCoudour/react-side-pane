import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import autoprefixer from "autoprefixer";
import postcss from "rollup-plugin-postcss";
import filesize from "rollup-plugin-filesize";
import banner2 from "rollup-plugin-banner2";
import { terser } from "rollup-plugin-terser";
import pkg from "./package.json";

const makeExternalPredicate = (externalArr) => {
	if (externalArr.length === 0) {
		return () => false;
	}
	return (id) => new RegExp(`^(${externalArr.join("|")})($|/)`).test(id);
};

const name = "ReactSidePane";
const env = process.env.NODE_ENV || "development";
const deps = [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})];
const external = makeExternalPredicate(deps);
const globals = {
	react: "React",
	"react-dom": "ReactDOM",
	"focus-trap-react": "FocusTrap",
	"body-scroll-lock ": "bodyScrollLock",
	"prop-types ": "PropTypes",
	"react-transition-group ": "reactTransitionGroup",
	"@babel/runtime/helpers/defineProperty": "_defineProperty$1",
	"@babel/runtime/helpers/slicedToArray": "_slicedToArray",
};
const plugins = [
	resolve(),
	babel({
		exclude: /node_modules/,
		include: "src/**/*",
		babelHelpers: "runtime",
		babelrc: true,
	}),
	commonjs(),
	postcss({
		plugins: [autoprefixer()],
		minimize: true,
		modules: true,
		autoModules: true,
		extract: false,
	}),
];
const prodPlugins = [terser()];
const endPlugins = [
	banner2(
		(chunk) => `
/** @license React SidePane v${pkg.version}
 * ${chunk.fileName}
 *
 * Copyright (c) Romain Coudour
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
`,
		{ sourcemap: false }
	),
	filesize(),
];

// Process
if (env === "production") {
	plugins.push(...prodPlugins);
}
plugins.push(...endPlugins);
export default [
	{
		input: "src/index.js",
		external,
		output: [
			{
				file: pkg.main,
				format: "cjs",
				exports: "named",
			},
			{
				file: pkg.module,
				format: "es",
				exports: "named",
			},
			{
				name,
				globals,
				file: pkg.browser,
				format: "umd",
				exports: "named",
			},
		],
		plugins,
	},
];
