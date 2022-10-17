import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	let lastUri: vscode.Uri;
	context.subscriptions.push(vscode.commands.registerCommand('mcfunction-debugger.askForFunctionPath', () => {
		let defaultUri = lastUri;
		if (!defaultUri && vscode.window.activeTextEditor) {
			defaultUri = vscode.window.activeTextEditor.document.uri;
		}
		return vscode.window.showOpenDialog({
			filters: { "mcfunction": ["mcfunction"] },
			title: "Select Minecraft function to debug.",
			defaultUri: defaultUri
		}).then((uri) => {
			if (uri) {
				lastUri = uri[0];
				return lastUri.fsPath;
			}
		});
	}));
}

export function deactivate() { }
