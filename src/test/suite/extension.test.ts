
import * as assert from 'assert';

import * as vscode from 'vscode';
import {getFileList, getMatchingFiles, stripFileName  } from "../../extension";

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');
	test('Strip file name should separate the base file name from the path and extensions', () => {
		assert.equal(stripFileName('path/to/file.js'), 'file');
		assert.equal(stripFileName('path/to/file.spec.js'), 'file');
		assert.equal(stripFileName('path\\to\\file.js'), 'file')
	});
});
