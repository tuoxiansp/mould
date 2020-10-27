import {
    Action,
    createAction,
    handleAction as originHandleAction,
} from 'redux-actions'
import { currentWorkspace } from './editorStateUtils'
import initialData from './initialData'
import { EditorState, Path, Vector } from './types'
import { pathToString, viewportPathToString } from './utils'

const handleAction = <T>(
    type,
    fn: (editor: EditorState, action: Action<T>) => EditorState
) =>
    originHandleAction<EditorState, T>(
        type,
        (state, action) => {
            return fn(state, action)
        },
        initialData
    )

type SelectComponentAction = { pathes: Path[] }
const SELECT_COMPONENT = 'SELECT_COMPONENT'
export const selectComponent = createAction<SelectComponentAction>(
    SELECT_COMPONENT
)
export const handleSelectComponent = handleAction<SelectComponentAction>(
    SELECT_COMPONENT,
    (state, { payload: { pathes } }) => {
        const workspace = currentWorkspace(state)
        if (!workspace) {
            throw Error(`Current workspace shouldn't be ${workspace}.`)
        }

        if (pathes.length === 0) {
            workspace.selection = undefined
        } else if (!workspace.selection) {
            workspace.selection = pathes[0]
        } else if (
            viewportPathToString(pathes[0]) !==
            viewportPathToString(workspace.selection)
        ) {
            workspace.selection = pathes[0]
        } else {
            const index = pathes.findIndex(
                (p) => pathToString(p) === pathToString(workspace.selection!)
            )
            if (index === -1) {
                const selectionStr = pathToString(workspace.selection)

                for (let path of pathes.reverse()) {
                    const pathStr = pathToString(path)
                    if (
                        selectionStr.includes(pathStr) ||
                        pathStr.slice(0, pathStr.length - 1) ===
                            selectionStr.slice(0, selectionStr.length - 1)
                    ) {
                        workspace.selection = path
                        break
                    }
                }
            } else {
                const nextSelection = pathes[index + 1]
                if (nextSelection) {
                    workspace.selection = nextSelection
                }
            }
        }

        return state
    }
)

type SelectComponentFromTreeAction = { path: Path | undefined }
const SELECT_COMPONENT_FROM_TREE = 'SELECT_COMPONENT_FROM_TREE'
export const selectComponentFromTree = createAction<
    SelectComponentFromTreeAction
>(SELECT_COMPONENT_FROM_TREE)
export const handleSelectComponentFromTree = handleAction<
    SelectComponentFromTreeAction
>(SELECT_COMPONENT_FROM_TREE, (state, { payload: { path } }) => {
    const workspace = currentWorkspace(state)
    if (!workspace) {
        throw Error(`Current workspace shouldn't be ${workspace}.`)
    }

    workspace.selection = path

    return state
})

type MoveWorkspaceActionType = Vector
export const MOVE_WORKSPACE = 'MOVE_WORKSPACE'
export const moveWorkspace = createAction<MoveWorkspaceActionType>(
    MOVE_WORKSPACE
)
export const handleMoveWorkspace = handleAction<MoveWorkspaceActionType>(
    MOVE_WORKSPACE,
    (state, action) => {
        const workspace = currentWorkspace(state)
        if (!workspace) {
            throw Error(`Current workspace shouldn't be ${workspace}.`)
        }
        workspace.position.x = action.payload.x
        workspace.position.y = action.payload.y

        return state
    }
)

type ZoomWorkspaceActionType = { zoom: number }
export const ZOOM_WORKSPACE = 'ZOOM_WORKSPACE'
export const zoomWorkspace = createAction<ZoomWorkspaceActionType>(
    ZOOM_WORKSPACE
)
export const handleZoomWorkspace = handleAction<ZoomWorkspaceActionType>(
    ZOOM_WORKSPACE,
    (state, action) => {
        const workspace = currentWorkspace(state)
        if (!workspace) {
            throw Error(`Current workspace shouldn't be ${workspace}.`)
        }
        workspace.zoom = action.payload.zoom

        return state
    }
)
