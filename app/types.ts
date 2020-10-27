import {
    ComponentType,
    ForwardRefExoticComponent,
    FunctionComponent,
} from 'react'
import * as z from 'zod'
import {
    ChildrenInspectorRenderer,
    ContainerLayoutProps,
} from '../inspector/InspectorProvider'
import { LayoutPropTypes } from '../inspector/Layout'

export type ID = string
export type ComponentIndex = number
export type Desc = string

export type Vector = {
    x: number
    y: number
}

export type Size = {
    width: number
    height: number
}

export type ViewportPath = number

export type Path = [ViewportPath, ComponentIndex[]]

export type ViewportBase = Size & Vector

export type MouldViewport = {
    type: 'Mould'
} & ViewportBase

export type KitViewport = {
    type: 'Kit'
    state: string
    targetName: string
} & ViewportBase

export type TemplateViewport = {
    type: 'Template'
    targetName: string
} & ViewportBase

export type Viewport = MouldViewport | KitViewport | TemplateViewport

//[prop-field, scope-field]
export type DataMappingVector = [string, string]

export type Component = {
    type: string
    props: object
    children?: Component[]
    dataMappingVectors: DataMappingVector
}

export type Template = {
    name: string
    component: Component
}

export type Kit = {
    name: string
    states: { [key: string]: Component }
}

export type InputConfig<Config = any> = {
    type: string
} & Config

export type Mould = {
    name: string
    input: { [key: string]: InputConfig }
    component: Component | undefined
}

export type Collection = {
    mould: Mould
    kits: Kit[]
    templates: Template[]
}

export type Workspace = {
    mouldName: string
    viewports: Viewport[]
    position: Vector
    zoom?: number
    selection?: Path
} & Collection

export type ComponentPropTypes = {
    requestUpdateProps?: (props: object) => void
    requestUpdateChildren?: (
        updateChildren: (children?: Component[]) => Component[] | undefined
    ) => void
    path?: Path
    connectedFields?: string[]
} & Component

export type CreatingStatus = 'none' | 'waiting' | 'start' | 'updating'

// export type Creating = ['none' | 'waiting' | 'start' | 'updating', View]
export type Creating = {
    status: 'waiting' | 'start' | 'updating'
    view: Viewport
    beginAt: Vector
    injectedKitName?: string
}

export type EditorState = {
    workspaces: Workspace[]
    currentWorkspace: string
}

// export type EditorState = {
//     testWorkspace: Workspace
//     views: { [key: string]: Viewport }
//     moulds: Mould[]
//     selection?: Path //[[mouldName, state], indexPath[]]
//     creating?: Creating
//     recursiveRendered?: string[]
//     isDragging?: boolean
//     debugging: Debugging
// }

export type ParentContextProps = {
    parent?: ParentContext
}
export type ParentContext = {
    props: object
    component: AtomicComponent
    childrenIndex: number
    childrenCompRef?: React.MutableRefObject<(SVGElement | HTMLElement)[]>
}

export type ChildrenMoveable = FunctionComponent<{
    target: HTMLElement
    requestUpdateProps: (prop: {
        containerLayoutProps?: ContainerLayoutProps
        layoutProps?: LayoutPropTypes
    }) => void
    props: {
        containerLayoutProps?: ContainerLayoutProps
        layoutProps?: LayoutPropTypes
    }
    parentContext: ParentContext
    path: Path
}>

export type AtomicComponent = {
    type: string
    Standard?: z.ZodObject<{ [key: string]: any }>
    Icon: ComponentType
    Editable: ForwardRefExoticComponent<any>
    Raw: ForwardRefExoticComponent<any>
    Transform?: (args: object, context?: ParentContext) => object
    ChildrenTransform?: (
        data: ContainerLayoutProps | undefined,
        parentProps: object,
        index: number
    ) => object
    ChildrenInspectorRenderer?: ChildrenInspectorRenderer
    ChildrenMoveable?: ChildrenMoveable
    acceptChildren?: boolean
}

export type useScopeFn = (input: object) => [object, string]

export type InspectorProps<T, Option = {}> = {
    data: T | undefined
    onChange: (data: T | undefined) => void
    title?: string
    connectedFields?: string[]
} & Option

export type Inspector<T, Option = {}> = FunctionComponent<
    InspectorProps<T, Option>
>

// export type Debugging = [ComponentPath | undefined, any?]
