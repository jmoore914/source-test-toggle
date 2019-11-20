import * as vscode from 'vscode';

export async function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('extension.sourceTestToggle', async () => {
		const editor = vscode.window.activeTextEditor
		if(editor){
			const openFile = editor.document.fileName
			const rootFolderUri = vscode.workspace.workspaceFolders![0].uri
			const fileList = await getFileList(rootFolderUri)
			const matches = getMatchingFiles(openFile, fileList)
			if(matches.length === 0){
				vscode.window.showErrorMessage('No matching file found.')
			}
			else if(matches.length === 1){
				vscode.window.showTextDocument(vscode.Uri.file(matches[0]))
			}
			else{
				const picked = await vscode.window.showQuickPick(matches)
				if(picked){
				vscode.window.showTextDocument(vscode.Uri.file(picked))
			}
		}
		}
		else{
			vscode.window.showErrorMessage('No active text editor.')
		}
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}


export async function getFileList(uri: vscode.Uri): Promise<string[]>{
	let fullFileList = []
	const exclude = vscode.workspace.getConfiguration('sourceTestToggle').exclude
	const direcAllContents = await vscode.workspace.fs.readDirectory(uri)
	const direcFilteredContents = direcAllContents.filter(item => !exclude.includes(item[0]))
	const direcFileList = direcFilteredContents
		.filter(item => item[1]===1)
		.map(item => uri.fsPath + '\\' + item[0])
	fullFileList.push(...direcFileList)
	const direcSubdirecList = direcFilteredContents
		.filter(item => item[1]===2)
		.filter(item => item[0] !== 'node_modules')
		.map(item => vscode.Uri.file(uri.fsPath + '\\' + item[0]))
	await Promise.all(direcSubdirecList.map(async (direc) => {
		const subdirecFileList = await getFileList(direc)
		fullFileList.push(...subdirecFileList)
	}))
	return fullFileList
}
 
export function getMatchingFiles(originalFile: string, fileList: string[]){
	const originalStrippedFileName = stripFileName(originalFile)
	const matches = fileList.filter(file => stripFileName(file) === originalStrippedFileName)
	const testKeywords =  vscode.workspace.getConfiguration('sourceTestToggle').testKeywords
	const isTestFile = testKeywords.some((testKeyword: string) => {
		return originalFile.includes(testKeyword)
	})
	const filteredMatches = isTestFile ?
		matches.filter(match => testKeywords.every((testKeyword: string) => {
			return !match.includes(testKeyword)
		})) :
		matches.filter(match => testKeywords.some((testKeyword: string) => {
			return match.includes(testKeyword)
		}))
	
	return filteredMatches
}

export function stripFileName(fullFilename:string):string{
	return fullFilename.replace(/^.*[\\\/]/, '').split('.')[0]
}