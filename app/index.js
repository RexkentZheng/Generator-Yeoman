const chalk = require('chalk');    //不同颜色的info
const yeoman = require('yeoman-generator');
const path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');

var Reactpackage = yeoman.Base.extend({
		initializing: function () {    //初始化准备工作
			this.log(chalk.red(
				'项目新建开始'
			));
		},
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
		},
		writing: {  //生成目录结构阶段
			app: function () {     
				mkdirp(`${this.props.name}`)
				this.fs.copyTpl(
					this.templatePath('src/components/Demo.js'),
					this.destinationPath(`${this.props.name}/src/components/Demo.js`),
				);
				this.fs.copyTpl(
					this.templatePath('src/images/clap.jpeg'),
					this.destinationPath(`${this.props.name}/src/images/clap.jpeg`),
				);
				this.fs.copyTpl(
					this.templatePath('src/settings/config.json'),
					this.destinationPath(`${this.props.name}/src/settings/config.json`),
				);
				this.fs.copyTpl(
					this.templatePath('src/styles/special.scss'),
					this.destinationPath(`${this.props.name}/src/styles/special.scss`),
				);
				this.fs.copyTpl(
					this.templatePath('src/app.js'),
					this.destinationPath(`${this.props.name}/src/app.js`),
				);
				this.fs.copyTpl(
					this.templatePath('src/index.tmpl.html'),
					this.destinationPath(`${this.props.name}/src/index.tmpl.html`),
				);
				this.fs.copyTpl(
					this.templatePath('./.eslintrc'),
					this.destinationPath(`${this.props.name}/.eslintrc`),
				);
				this.fs.copyTpl(
					this.templatePath('./.eslintignore'),
					this.destinationPath(`${this.props.name}/.eslintignore`),
				);
				this.fs.copyTpl(
					this.templatePath('./.gitignore'),
					this.destinationPath(`${this.props.name}/.gitignore`),
				);
				this.fs.copyTpl(
					this.templatePath('./.babelrc'),
					this.destinationPath(`${this.props.name}/.babelrc`),
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
    },
    end: function () {
			this.log(chalk.green(
				'项目新建完成'
			));
    }
});
module.exports = Reactpackage;