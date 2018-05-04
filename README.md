[![NPM version](https://img.shields.io/npm/v/brick.js.svg?style=flat)](https://www.npmjs.com/package/generator-sfe)
[![Build Status](https://travis-ci.org/brick-js/brick.js.svg?branch=master)](https://travis-ci.org/brick-js/brick.js)
# 基于Yeoman的脚手架工具
## 内容
### 包含eslint(airbnb),react,mbox,sass,antd
## 自定义
### 可以自定义项目名称和端口号
## 使用方法
### https://www.npmjs.com/package/generator-sfe

## 编写过程
### 一、webpack配置
首先是要写一个webpack的配置文件，这样就可以用webpack启动项目，这里使用的是webpack4.0。既然要用当然得用最新的啦，当然了，其中也遇到了一些坑。
#### 1.1 mode的定义
在webpack4.0以上的版本中都添加了`mode`属性，意在标明当前是生产模式还是开发者模式，当然了，其更重要的意义是默认了一些配置，这样就在一定程度上减少了webpack的配置。具体的配置可以参考[官方文档](https://webpack.js.org/concepts/mode/)
#### 1.2 optimization的使用
在webpack4.0以上的版本中将部分插件内置了，这样就需要使用`optimization`这个属性来使用这些插件，具体操作也请查看[官方文档](https://github.com/webpack/docs/wiki/optimization)
### 二、各种插件的安装
就是eslint和mobx之类的插件的安装，当然，最重要的还是react的安装。
#### 2.1 react的安装
想要支持react，首先需要babel的支持，关于babel的插件这里安装的比较全面,大家可以参考下。
```
"devDependencies": {
  "babel-core": "^6.26.0",
  "babel-eslint": "^8.2.2",
  "babel-loader": "^7.1.4",
  "babel-plugin-import": "^1.6.7",
  "babel-plugin-react-transform": "^3.0.0",
  "babel-plugin-transform-class-properties": "^6.24.1",
  "babel-plugin-transform-decorators-legacy": "^1.3.4",
  "babel-preset-env": "^1.6.1",
  "babel-preset-react": "^6.24.1",
  "babel-preset-react-native-stage-0": "^1.0.1",
  "babel-preset-stage-0": "^6.24.1",
  "babel-preset-stage-1": "^6.24.1",
  }
```
之后修改webpack.config的配置
```
module: {
  rules: [
    {
      test: /\.(js|jsx)$/,
      loader: 'babel-loader',
      exclude: /node_modules/
    }
  ]
}
```
这样就差不多了，其实说的不是很详细，但大体上就是这样的一个过程，如果个人配置还是出现了问题，可以参考项目中的webpack.config
#### 2.2 mobx的安装
采用的是最新的4.1.1版本，新版本也是问题多多，详情请参阅官方API。在使用时请注意，如果使用了mobx和mobx-react两个插件，请声明`{ isolateGlobalState: true }`,严格模式请声明`{ enforceActions: true }`,放在improt后面就好。语法变化较大，谨记，下为例子：
```
import { observable, action, configure } from 'mobx';
import { observer } from 'mobx-react';
import config from './../settings/config.json';
import img from './../images/clap.jpeg';

configure({ isolateGlobalState: true }, { enforceActions: true });

class MyState {
  @observable num = 0;

  @action addNum = () => {
    if (this.num < 10) {
      this.num += 1;
    }
  };
}
```
#### 2.3 eslint的安装
其实这部分还好，就是得自己写`eslintrc`文件，具体过程如下：  
首先安装依赖
```
"devDependencies": {
  "eslint": "^4.19.1",
  "eslint-config-airbnb": "^16.1.0",
  "eslint-loader": "^2.0.0",
  "eslint-plugin-import": "^2.9.0",
  "eslint-plugin-jsx-a11y": "^6.0.3",
  "eslint-plugin-react": "^7.7.0",
  }
```
之后进行webpack配置
```
module: {
	rules: [
  {
    test: /\.js$/,
		loader: 'eslint-loader',
		enforce: 'pre',
		exclude: /node_modules/,
		options: {
		  emitWarning: true,
		  emitError: true,
		}
  }
  ]
}
```
最后书写eslint配置
```
{
  "env": {
    "es6": true,
    "browser": true,
    "commonjs": true
  },
  "parser": "babel-eslint",
  "extends": "airbnb",
  "rules": {
    //不允许以下划线命名变量或者函数，如果有特殊情况请在下面加上变量名或函数名
    "no-underscore-dangle": ["error", {
      "allow": [
      ]
    }],
    // 后缀可以是js或者是jsx
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
  }
}
```
还有eslintIgnore
```
# Ignore built files except build/index.js
build/*
!build/index.js
antd
webpack.config.js
*.png
```
到此项目基本上就可以跑起来了，可以测试下，完成之后进行下一步。
### 三、使用Yeoman构建脚手架
关于Yeoman的使用其实官网上并不详细，具体的设置部分只是一笔带过，诸位可以参考[这篇博客](https://scotch.io/tutorials/create-a-custom-yeoman-generator-in-4-easy-steps)，这位大哥说的就很好。
#### 3.1 `initializing`部分
这感觉一般就是用来告诉用户这个工具已经开始使用了，这里我就是只`log`了一句话。
```
initializing: function () {
  this.log(chalk.red(
  '项目新建开始'
  ));
}
```
#### 3.2 `prompting`部分
这部分其实就是获取用户输入的信息，比方说用户想给这个项目定义个什么名字啊，或者暴露的端口号多少啊之类的。主要用法就是`return`用户输入的信息，放到`this.props`里面，之后再下面就可以随意调用了。
```
prompting() {
	return this.prompt([{
			type: 'input',
			name: 'name',
			message: '请输入项目名字',
			default: 'sfe'
	},{
		type: 'input',
		name: 'port',
		message: '请输入端口号',
		default: '2333'
	}]).then((answers) => {
			this.log('项目名称: ', answers.name);
			this.log('端口号：',answers.port);
			this.props = answers;
	});
}
```
#### 3.3 `writing`部分
这部分的功能就是把文件写入到生成的脚手架中，一般在这里就会用到上面`prompting`定义的信息，而且可以当做一个变量放到需要使用的文件里，由于这部分内容比较多，在此截取部分供大家进行参考。
```
writing: {
  app: function () {
    mkdirp(`${this.props.name}`)
    this.fs.copyTpl(
	  this.templatePath('src/components/Demo.js'),
	  this.destinationPath(`${this.props.name}/src/components/Demo.js`),
	);
	this.fs.copyTpl(
	  this.templatePath('./package.json'),
	  this.destinationPath(`${this.props.name}/package.json`), {
		name: this.props.name
	  }
	);
	this.fs.copyTpl(
	  this.templatePath('./webpack.config.js'),
	  this.destinationPath(`${this.props.name}/webpack.config.js`),{
		port: this.props.port
	  }
	);
  }
}
```
#### 3.4 `end` 部分
最后一部分啦，就是项目完成之后想要进行的操作，在这里也就是习惯性的输出一个完成语句。
```
end: function () {
  this.log(chalk.green(
    '项目新建完成'
  ));
}
```
以上就是Yeoman部分参数的内容，其实还有很多参数，只是常用的感觉就只有这些。
### 四、本地调试与发布项目
#### 4.1 本地调试
使用`npm link`来进行项目的本地化，这样就直接在本地调试啦
#### 4.2 注册npm账号
这也不用多少啥了。
#### 4.3 上传
先使用`npm adduser`命令来输入自己的用户名，密码等相关信息。  
之后使用`npm publish`来发布，要注意的是记得每次发布之前去package.json中修改版本号。  
这样就好啦，还有一个问题是发布包的名字不能和已有项目的名字重复，切记。
### 五、结语
其实上面的讲解只是针对部分API，基础知识部分并没有涉及到，想要知道有两种选择，第一就是直接参考项目中`index.js`的内容，第二就是去看我在上面提到了外国博主的博客，写的真是很好，就算英语不好也能看懂，信我。
### PS
有问题就给我发邮件吧`rexkentzheng@qq.com`。:)