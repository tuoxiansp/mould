import { EditorState } from './types'

export const currentWorkspace = (editorState: EditorState) => {
    return editorState.workspaces.find(
        (workspace) => workspace.mouldName === editorState.currentWorkspace
    )
}
