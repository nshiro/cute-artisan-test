# Cute Artisan Test

This extension allows you to run tests in Laravel on the fly.
It is a bit like `Better PHPUnit`, with lower functionality, but with its own advantages.


## Features
- This is an extension for Laravel testing.
- You can test the method where the cursor is located. (You can also test the entire file.)
- You can call the last test performed.
- The command is executed in the terminal (not in the form of a task).
- Pest is also supported.
- Mixed use of PHPUnit and Pest is supported.
- Multibyte character test names in PHPUnit are also supported.
- The default test command is `php artisan test`. You can change it in the configuration file.

## Run a test method:
- Place your cursor in/on the method you want to run
- Open the command menu: `cmd+shift+p`
- Select: `Cute Artisan Test: run`
- If you want to test the entire file, move the cursor to the top and then execute the command.

## Run the previous test:
- Open the command menu: `cmd+shift+p`
- Select: `Cute Artisan Test: run previous`


## Extension Settings
This extension contributes the following settings:

* `cute-artisan-test.testCommand`: If this is not set, it will fall back to `php artisan test`.
* `cute-artisan-test.terminalFocus.enabled`: Determines whether the terminal is focused after the test.
* `cute-artisan-test.phpunitAndPestInMixedMode.enabled`: When set to `true` (default), the contents of the file under test are used to guess whether the file is PHPUnit or Pest. If disabled, only Pest is supported if the file `vendor/bin/pest` exists, otherwise only PHPUnit is supported. If you have problems getting test names in mixed mode, please change this setting accordingly.

## Key bindings

Please set your preferred key bindings.

Example of a `keybindings.json' file

```json
{
    {
        "key": "cmd+c cmd+r",
        "command": "cute-artisan-test.run",
        "when": "editorTextFocus && editorLangId == php"
    },
    {
        "key": "cmd+c cmd+p",
        "command": "cute-artisan-test.run-previous"
    }
]
```

## Minor details.
- The test name is attempted to be retrieved by scanning up from the cursor location. If it cannot be retrieved, the entire file is tested.
- In mixed mode, the first 25 lines of the file are used to determine if it's a PHPUnit or Pest file. And if there is a line such as `class xxx extends TestCase`, it is considered to be a PHPUnit file.
- In PHPUnit, the test name of the command will be in the form of "\A.*:xxxxxxx\\z". This is to prevent other test names starting with the same name from being executed.


## Known Issues
- The extension does not work properly while your terminal is waiting for a keystroke.


## FYI
In the terminal, you can `Ctrl/Cmd + click` messages like `tests/Feature/ExampleTest.php:37` to open the corresponding file in the editor.


**Have fun!**
