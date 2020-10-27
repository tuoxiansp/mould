import { useSelector } from 'react-redux'
import { currentWorkspace } from './editorStateUtils'
import { EditorState } from './types'

// !!! You should never use this hook, because it will break down the performance !!!
export const useCurrentWorkspace = () => {
    const workspace = useSelector((state: EditorState) =>
        currentWorkspace(state)
    )

    return workspace
}

export const usePositionInCurrentWorkspace = () => {
    const position = useSelector((state: EditorState) => {
        const workspace = currentWorkspace(state)
        if (!workspace) {
            return
        }

        return workspace.position
    })

    return position
}

export const useZoomInCurrentWorkspace = () => {
    const zoom = useSelector((state: EditorState) => {
        const workspace = currentWorkspace(state)
        if (!workspace) {
            return
        }

        return workspace.zoom
    })

    return zoom
}

export const useSelectionInCurrentWorkspace = () => {
    const selection = useSelector((state: EditorState) => {
        const workspace = currentWorkspace(state)
        if (!workspace) {
            return
        }

        return workspace.selection
    })

    return selection
}

export const useViewportsInCurrentWorkspace = () => {
    const viewports = useSelector((state: EditorState) => {
        const workspace = currentWorkspace(state)
        if (!workspace) {
            return
        }

        return workspace.viewports
    })

    return viewports
}

export const useMouldInCurrentWorkspace = () => {
    const mould = useSelector((state: EditorState) => {
        const workspace = currentWorkspace(state)
        if (!workspace) {
            return
        }

        return workspace.mould
    })

    return mould
}

export const useKitsInCurrentWorkspace = () => {
    const kits = useSelector((state: EditorState) => {
        const workspace = currentWorkspace(state)
        if (!workspace) {
            return
        }

        return workspace.kits
    })

    return kits
}

export const useTemplatesInCurrentWorkspace = () => {
    const templates = useSelector((state: EditorState) => {
        const workspace = currentWorkspace(state)
        if (!workspace) {
            return
        }

        return workspace.templates
    })

    return templates
}
