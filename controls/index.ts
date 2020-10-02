import * as StringControl from './StringControl'
import * as NumberControl from './NumberControl'
import * as BooleanControl from './BooleanControl'
import * as FunctionControl from './FunctionControl'
import { FunctionComponent } from 'react'

export default {
    string: StringControl,
    number: NumberControl,
    boolean: BooleanControl,
    function: FunctionControl,
} as {
    [key: string]: {
        Editor: FunctionComponent
        Renderer: FunctionComponent<any>
    }
}
