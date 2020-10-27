import { Flex } from '@modulz/radix'
import React from 'react'
import { Provider } from 'jotai'
// import LeftMenu from './Aside/LeftMenu'
// import RightMenu from './Aside/RightMenu'
// import Toolbar from './Toolbar'
import { Canvas } from './Canvas'

const HEADER_HEIGHT = 50

export const MouldWorkspace = () => {
    return (
        <Provider>
            <Flex
                translate
                position="absolute"
                flexDirection="column"
                bg="#f1f1f1"
                minHeight="100vh"
                alignItems="stretch"
            >
                <Canvas></Canvas>
            </Flex>
        </Provider>
    )
}
