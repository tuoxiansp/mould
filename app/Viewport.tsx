import React, { useEffect, useRef, useState } from 'react'
import { Text } from '@modulz/radix'
import dynamic from 'next/dynamic'
import { Component, Path, Viewport as ViewportType } from './types'
import {
    useKitsInCurrentWorkspace,
    useMouldInCurrentWorkspace,
    useSelectionInCurrentWorkspace,
    useTemplatesInCurrentWorkspace,
} from './useStore'
import { tick } from './selectionTick'

const Moveable = dynamic(() => import('react-moveable'), {
    ssr: false,
    loading: () => null,
})

export const Viewport = ({
    viewport,
    index,
}: {
    viewport: ViewportType
    index: number
}) => {
    const mould = useMouldInCurrentWorkspace()
    const templates = useTemplatesInCurrentWorkspace()
    const kits = useKitsInCurrentWorkspace()
    const selection = useSelectionInCurrentWorkspace()
    const ref = useRef()
    const [ready, setReady] = useState(false)

    useEffect(() => {
        setReady(true)
    }, [ref.current])

    if (!mould || !templates || !kits) {
        return null
    }

    const symbol =
        viewport.type === 'Mould'
            ? `Export`
            : `${viewport.type}-${viewport.targetName}${
                  viewport.type === 'Kit' ? '-' + viewport.state : ''
              }`

    const path: Path = [index, []]
    const selected =
        selection && selection[0] === index && selection[1].length === 0

    let component: Component | undefined
    switch (viewport.type) {
        case 'Mould':
            component = mould.component
            break
        case 'Template':
            component = templates.find((template) => template.name)?.component
            break
        case 'Kit':
            component = kits.find((kit) => kit.name === viewport.targetName)
                ?.states[viewport.state]
    }

    return (
        <>
            {selected && ready && (
                <Moveable
                    target={ref.current}
                    resizable
                    draggable
                    snappable
                    snapCenter
                    isDisplaySnapDigit={false}
                    origin={false}
                    throttleResize={0}
                    edge
                    // onResize={({
                    //     target,
                    //     width,
                    //     height,
                    //     dist: [mx, my],
                    //     direction: [dx, dy],
                    // }) => {
                    //     target.style.width = width + 'px'
                    //     target.style.height = height + 'px'
                    //     target.style.left = (dx === -1 ? x - mx : x) + 'px'
                    //     target.style.top = (dy === -1 ? y - my : y) + 'px'
                    // }}
                    // onResizeEnd={({ target }) => {
                    //     dispatch(
                    //         resizeView({
                    //             viewId,
                    //             width: parseFloat(target.style.width),
                    //             height: parseFloat(target.style.height),
                    //         })
                    //     )
                    //     dispatch(
                    //         dragView({
                    //             id: viewId,
                    //             x: parseFloat(target.style.left),
                    //             y: parseFloat(target.style.top),
                    //         })
                    //     )
                    // }}
                    onDrag={({ target, left, top, inputEvent }) => {
                        if (inputEvent.buttons !== 4) {
                            target.style.left = left + 'px'
                            target.style.top = top + 'px'
                        }
                    }}
                    onDragStart={({ inputEvent }) => {
                        if (inputEvent.target.tagName === 'INPUT') {
                            return false
                        }
                    }}
                    // onDragEnd={({ target }) => {
                    //     dispatch(
                    //         dragView({
                    //             id: viewId,
                    //             x: parseFloat(target.style.left),
                    //             y: parseFloat(target.style.top),
                    //         })
                    //     )
                    // }}
                    // elementGuidelines={otherViews.map(
                    //     (v) => document.getElementById(`view-${v}`)!
                    // )}
                ></Moveable>
            )}
            <div
                ref={(dom) => {
                    ref.current = dom as any
                }}
                style={{
                    position: 'absolute',
                    width: viewport.width,
                    height: viewport.height,
                    transform: `translateX(${viewport.x}px) translateY(${viewport.y}px)`,
                    background: '#fff',
                }}
                onDoubleClick={() => {
                    if (!component) {
                        tick((tickData = []) => {
                            tickData.unshift(path)

                            return tickData
                        })
                    }
                }}
            >
                <div
                    style={{
                        cursor: 'grab',
                        position: 'absolute',
                        top: -25,
                    }}
                >
                    <Text truncate size={1} textColor="rgb(132,132,132)">
                        {symbol}
                    </Text>
                </div>
            </div>
        </>
    )
}
