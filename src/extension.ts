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


async function getFileList(uri: vscode.Uri): Promise<string[]>{
	let fullFileList = []
	const direcAllContents = await vscode.workspace.fs.readDirectory(uri)
	const direcFileList = direcAllContents
		.filter(fileType => fileType[1]===1)
		.map(fileType => uri.fsPath + '\\' + fileType[0])
	fullFileList.push(...direcFileList)
	const direcSubdirecList = direcAllContents
		.filter(fileType => fileType[1]===2)
		.filter(fileType => fileType[0] !== 'node_modules')
		.map(fileType => vscode.Uri.file(uri.fsPath + '\\' + fileType[0]))
	await Promise.all(direcSubdirecList.map(async (direc) => {
		const subdirecFileList = await getFileList(direc)
		fullFileList.push(...subdirecFileList)
	}))
	return fullFileList
}
 
function getMatchingFiles(originalFile: string, fileList: string[]){
	const originalStrippedFileName = stripFileName(originalFile)
	const matches = fileList.filter(file => stripFileName(file) === originalStrippedFileName)
	return matches.filter(match => match !== originalFile )
}

function stripFileName(fullFilename:string):string{
	return fullFilename.replace(/^.*[\\\/]/, '').split('.')[0]
}