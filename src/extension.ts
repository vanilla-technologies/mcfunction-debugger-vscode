import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
	let lastUri: vscode.Uri;
	context.subscriptions.push(vscode.commands.registerCommand("mcfunction-debugger.askForFunctionPath", () => {
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

	context.subscriptions.push(vscode.debug.registerDebugAdapterDescriptorFactory("mcfunction", new DebugAdapterDescriptorFactory()));
}

class DebugAdapterDescriptorFactory implements vscode.DebugAdapterDescriptorFactory {
	createDebugAdapterDescriptor(session: vscode.DebugSession, executable: vscode.DebugAdapterExecutable | undefined): vscode.ProviderResult<vscode.DebugAdapterDescriptor> {
		if (!executable) {
			return executable;
		}
		let adapterConfig = vscode.workspace.getConfiguration("mcfunctionDebugger.adapter");

		let args = executable.args;
		let logFile = adapterConfig.get("log.file");
		if (logFile) {
			args.push("--log-file=" + logFile);
		}
		let logLevel = adapterConfig.get("log.level");
		if (logLevel) {
			args.push("--log-level=" + logLevel);
		}

		let options = executable.options ?? {};
		if (!options.cwd) {
			options.cwd = vscode.workspace.workspaceFolders?.[0]?.uri?.fsPath;
		}

		return new vscode.DebugAdapterExecutable(executable.command, args, options);
	}
}

export function deactivate() { }
