# Usage

Run the command "Source/Test Toggle" to switch between the source code and test file for the active editor.

Default keybinding: `ctrl + alt + t`

# Settings

**Test Keywords**

Name: `sourceTestToggle.testKeywords`

Description: Keywords to include when searching for matching test files  

Example: If set to `["customKeyword", "spec"]`, using the toggle on the file  'exampleFile.js' would toggle to exampleFile.customKeyword.js and exampleFile.spec.js but not exampleFile.test.js

Defaults: `["test", "spec"]`

**Exclude**

Name: `sourceTestToggle.exclude`

Description: Directories to exclude when searching for matching files

Defaults: `["node_modules", ".git", ".vscode", dist"]`