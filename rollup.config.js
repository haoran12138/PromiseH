// rollup.config.ts
import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from 'rollup-plugin-json';

const config = {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/promise.esm.js',
      format: 'esm',
      sourcemap: true,
    },
    {
      file: 'dist/promise.cjs.js',
      format: 'cjs',
      sourcemap: true,
    }
  ],
  plugins: [
    json(),
    resolve({ extensions: ['.ts'] }),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json',
      compilerOptions: {
        declaration: true,
        declarationDir: 'dist/types'
      }
    }),
    // terser()
  ],
  external: ['lodash']
};

export default config; // 必须默认导出
