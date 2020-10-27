import { EditorState } from './types'

export default {
    workspaces: [
        {
            mouldName: 'Index',
            position: {
                x: 238,
                y: 87,
            },
            viewports: [
                {
                    type: 'Mould',
                    x: 51,
                    y: 23,
                    width: 467,
                    height: 518,
                },
            ],
            mould: {
                name: 'Index',
                input: {},
                component: undefined,
            },
            kits: [],
            templates: [],
        },
    ],
    currentWorkspace: 'Index',
} as EditorState
