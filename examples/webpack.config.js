import fs from 'fs'
import path, { dirname } from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { fileURLToPath } from 'url';
import CopyWebpackPlugin from 'copy-webpack-plugin'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


// 自动发现所有示例目录（排除node_modules等特殊目录）
function getExampleFolders() {
  return fs.readdirSync(__dirname, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .filter(dirent => !['node_modules', 'dist'].includes(dirent.name))
    .map(dirent => dirent.name);
}

// 为每个示例创建配置
function createExampleConfigs() {
  const folders = getExampleFolders();

  const entry = {};
  const plugins = [];
  const rewrites = [];

  folders.forEach(folder => {
    // 入口配置
    entry[folder] = `./${ folder }/index.ts`;

    // HTML插件
    plugins.push(new HtmlWebpackPlugin({
      template: `./${ folder }/index.html`,
      filename: `${ folder }/index.html`,
      chunks: [folder],
      inject: true
    }));

    // 开发服务器重写规则
    rewrites.push({
      from: new RegExp(`^/${folder}`),
      to: `/${ folder }/index.html`
    });
  });

  // 添加导航首页（可选）
  if (fs.existsSync('index.html')) {
    plugins.push(new HtmlWebpackPlugin({
      template: 'index.html',
      filename: 'index.html',
      inject: false
    }));
  }

  return { entry, plugins, rewrites };
}

const { entry, plugins, rewrites } = createExampleConfigs();

export default {
  mode: 'development',
  entry,
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name]/[name].bundle.js',
    publicPath: '/'
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    port: 3000,
    historyApiFallback: {
      rewrites: [
        { from: /^\/$/, to: '/index.html' },
        ...rewrites
      ]
    },
    hot: true,
    open: true
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        type: 'asset/resource'
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  plugins: [...plugins,
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'global.css', // 源文件路径
          to: 'global.css'   // 输出到 dist 目录的路径
        }
      ]
    })
  ],
};
