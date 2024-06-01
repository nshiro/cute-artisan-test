const vscode = require('vscode');
const Cute = require('./src/main.js');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  let disposables = [];

  disposables.push(vscode.commands.registerCommand('cute-artisan-test.run', () => {
    const cute = new Cute();
    cute.phpunitFilter();
  }));

  disposables.push(vscode.commands.registerCommand('cute-artisan-test.run-previous', () => {
    const cute = new Cute();
    cute.runLastCommand();
  }));

  context.subscriptions.push(disposables);
}

module.exports = {
	activate
}
