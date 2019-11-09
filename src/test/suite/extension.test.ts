
import * as assert from 'assert';

import * as vscode from 'vscode';
import {getFileList, getMatchingFiles, stripFileName  } from "../../extension";

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');
	test('stripFileName should separate the base file name from the path and extensions', () => {
		assert.equal(stripFileName('path/to/file.js'), 'file');
		assert.equal(stripFileName('path/to/file.vue'), 'file');
		assert.equal(stripFileName('path/to/file.spec.js'), 'file');
		assert.equal(stripFileName('path\\to\\file.test.js'), 'file')
	});

	test('getMatchingFiles should filter a file list to files that match the orginal file', () => {
		const fileList = [
			'path/to/file1.js', 
			'path/to/file2.js',
			'path/to/file1.spec.js',
			'path/to/file1.test.js',
			'otherPath/to/file1.js',
			'otherPath/to/file2.spec.js']
		assert.deepEqual(
			getMatchingFiles('path/to/file1.js', fileList),
			['path/to/file1.spec.js','path/to/file1.test.js'])
		assert.deepEqual(
			getMatchingFiles('path/to/file1.spec.js', fileList),
			['path/to/file1.js','otherPath/to/file1.js'])

	})
});
