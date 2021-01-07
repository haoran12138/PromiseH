import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import sourceMaps from 'rollup-plugin-sourcemaps'
import camelCase from 'lodash.camelcase'
import typescript from 'rollup-plugin-typescript2'
import json from 'rollup-plugin-json'
const pkg = require('./package.json')

const libraryName = 'promiseh'

export default {
  input: `src/index.ts`,
  output: [
    { file: 'dist/promiseh.umd.js', name: camelCase(libraryName), format: 'umd', sourcemap: false },
    { file: 'dist/promiseh.es.js', format: 'es', sourcemap: false },
    { file: 'dist/promiseh.esm.js', format: 'esm', sourcemap: false }
  ],
  // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
  external: [],
  watch: {
    include: 'src/**'
  },
  plugins: [
    // Allow json resolution
    json(),
    // Compile TypeScript files
    typescript({ useTsconfigDeclarationDir: true }),
    // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
    commonjs(),
    // Allow node_modules resolution, so you can use 'external' to control
    // which external modules to include in the bundle
    // https://github.com/rollup/rollup-plugin-node-resolve#usage
    resolve(),
   
    // Resolve source maps to the original source
    // sourceMaps(),
  ]
}
