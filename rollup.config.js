import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import replace from "@rollup/plugin-replace";
import babel from "@rollup/plugin-babel";
import { sizeSnapshot } from "rollup-plugin-size-snapshot";
import autoprefixer from "autoprefixer";
import postcss from "rollup-plugin-postcss";
import pkg from "./package.json";

const external = Object.keys(pkg.peerDependencies || {});
const globals = { react: "React", "react-dom": "ReactDOM" };
const name = "ReactSidePane";
const env = process.env.NODE_ENV || "development";
const plugins = [
	resolve(),
	postcss({
		plugins: [autoprefixer()],
		minimize: true,
		modules: true,
		autoModules: true,
		extract: false,
	}),
	babel({
		exclude: /node_modules/,
		babelHelpers: "runtime",
	}),
	commonjs(),
	replace({ "process.env.NODE_ENV": JSON.stringify(env), preventAssignment: true }),
	sizeSnapshot(),
];

export default [
	{
		input: "src/index.js",
		external,
		output: [
			{ exports: "auto", sourcemap: true, file: pkg.main, format: "cjs" },
			{ exports: "auto", sourcemap: true, file: pkg.module, format: "es" },
			{
				name,
				globals,
				exports: "auto",
				sourcemap: true,
				file: pkg.browser,
				format: "umd",
			},
		],
		plugins,
	},
];
