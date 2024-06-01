const vscode = require('vscode');

const workspaceFolders = vscode.workspace.workspaceFolders;
const fs = require('fs');
const path = require('path');
const rootPath = workspaceFolders[0].uri.fsPath;
let lastCommand;

module.exports = class Cute {
  constructor() {
    this.config = vscode.workspace.getConfiguration('cute-artisan-test')
  }

  /**
   * Filters PHPUnit tests based on the active text editor and runs the filtered tests.
   */
  async phpunitFilter() {
    const editor = vscode.window.activeTextEditor;
    const configTestCommand = this.config.get('testCommand');
    let isPest;
    let finalCommand;

    if (!editor) {
      return;
    }

    isPest = this.config.get('phpunitAndPestInMixedMode.enabled')
      ? !this.isPhpUnitFile(editor)
      : fs.existsSync(path.join(rootPath, 'vendor/bin/pest'));

    finalCommand = configTestCommand !== '' ? configTestCommand : 'php artisan test';

    const testName = this.getTestFunctionName(isPest, editor);

    if (testName) {
      finalCommand += ' --filter ' + (isPest ? testName : `'\\A.*:${testName}\\z'`); // To support git bash, I use `:` instead of `::`.
    }

    if (vscode.workspace.workspaceFolders === undefined) {
      vscode.window.showErrorMessage('Set your workspace folder first.');
    }

    const workspaceFolder = vscode.workspace.workspaceFolders[0];
    const relativeFilePath = path.relative(workspaceFolder.uri.fsPath, editor.document.uri.fsPath);

    finalCommand += ' ' + this.normalizePath(relativeFilePath);

    const terminal = this.getTerminal();
    this.clearTerminal(terminal);
    terminal.sendText(finalCommand);

    lastCommand = finalCommand;
  }

  /**
   * Runs the last executed test command.
   */
  async runLastCommand() {
    if (lastCommand === undefined) {
      vscode.window.showErrorMessage('There is no previous test run.');
      return;
    }

    const terminal = this.getTerminal();
    this.clearTerminal(terminal);
    terminal.sendText(lastCommand);
  }

  /**
   * Retrieves the name of the test function based on the current selection in the active text editor.
   *
   * @param {boolean} isPest - Indicates whether the test framework is Pest.
   * @returns {string} - The name of the test function.
   */
  getTestFunctionName(isPest, editor) {
    let lineAt = editor.selection.active.line;

    while (lineAt > 0) {
      const lineText = editor.document.lineAt(lineAt).text;
      const match = isPest ?
        /^\s*(?:it|test)\(([^,)]+)/m.exec(lineText) :
        /^\s*(?:public|private|protected)?\s*function\s*(\S+)\s*\(.*$/.exec(lineText);

      if (match) {
        // In the case of pest, single or double quotes may be included in the characters of the test name,
        // so the test name is obtained as is, including the leading and trailing single or double quotes.
        return match[1];
      }

      lineAt = lineAt - 1;
    }
  }

  /**
   * Determines if the current file is using PHPUnit for testing.
   * @returns {boolean} True if PHPUnit is being used, false otherwise.
   */
  isPhpUnitFile(editor) {
    const lineCount = editor.document.lineCount;
    let lineAt = 0;

    // Scan the file from the beginning to the 25th line, looking for the line "class xxx extends TestCase"
    // and determine that it is PHPUnit if present.
    while (lineAt < 25) {
      if (lineAt >= lineCount) {
        break;
      }

      const lineText = editor.document.lineAt(lineAt).text;
      const match = /^class\s+(\S+)\s+extends\s+TestCase.*$/.exec(lineText);

      if (match) {
        return true;
      }

      lineAt = lineAt + 1;
    }

    return false;
  }

  /**
   * Normalizes the file path for the command line.
   * @param {string} path - The file path to normalize.
   * @returns {string} The normalized file path.
   */
  normalizePath(path) {
    return path
      .replace(/\\/g, '/') // Convert backslashes from windows paths to forward slashes, otherwise the shell will ignore them.
      .replace(/ /g, '\\ '); // Escape spaces.
  }

  /**
   * Retrieves the terminal to use for running commands.
   * @returns {vscode.Terminal} The terminal to use.
   */
  getTerminal() {
    const terminals = vscode.window.terminals;
    const terminalFocusEnabled = this.config.get('terminalFocus.enabled');

    // The currently active terminal or undefined.
    // The active terminal is the one that currently has focus or most recently had focus.
    let terminal = vscode.window.activeTerminal;

    if (!terminal && terminals.length > 0) {
      terminal = terminals[0]; // If you don't have an active terminal, but have a previous terminal open (like when you just opened vscode)
    }

    if (!terminal) {
      terminal = vscode.window.createTerminal();
    }

    terminal.show(!terminalFocusEnabled);

    return terminal
  }

  /**
   * Clears the terminal.
   */
  async clearTerminal(terminal) {
    if (process.platform === 'win32') {
      // cmd ... `cls` only.
      // git bash ... `clear` only.
      // pwsh ... either is fine.
      terminal.sendText(terminal.name === 'cmd' ? 'cls' : 'clear');
    } else {
      // This command does not work correctly in a Windows shell.
      await vscode.commands.executeCommand('workbench.action.terminal.clear');
    }
  }
}
