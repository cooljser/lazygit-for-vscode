import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "lazygit.openLazygit",
    openLazygit
  );

  context.subscriptions.push(disposable);
}

async function openLazygit() {
  if (!(await focusActiveLazygitInstance())) {
    await newLazygitInstance();
  }
}

/**
 * Tries to find an instance and focus on the tab.
 * @returns If an instance was found and focused
 */
async function focusActiveLazygitInstance(): Promise<boolean> {
  for (let openTerminal of vscode.window.terminals) {
    if (openTerminal.name === "lazygit") {
      openTerminal.show();
      return true;
    }
  }
  return false;
}

async function newLazygitInstance() {
  // Always create a new terminal
  let terminal = vscode.window.createTerminal();

  terminal.sendText("lazygit && exit");
  terminal.show();

  // Move the terminal to the editor area
  await vscode.commands.executeCommand(
    "workbench.action.terminal.moveToEditor"
  );

  // Move focus back to the editor view
  await vscode.commands.executeCommand(
    "workbench.action.focusActiveEditorGroup"
  );

  vscode.window.onDidCloseTerminal((closedTerminal) => {
    if (closedTerminal === terminal) {
      vscode.commands.executeCommand('workbench.action.focusActiveEditorGroup');
    }
  });
}

export function deactivate() {}
