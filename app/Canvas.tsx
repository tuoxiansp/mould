import React, { memo, useEffect, useState } from 'react'
import { Text } from '@modulz/radix'
import {
    usePositionInCurrentWorkspace,
    useViewportsInCurrentWorkspace,
    useZoomInCurrentWorkspace,
} from './useStore'
import { tick } from './selectionTick'
import { Component, Path } from './types'
import { Viewport } from './Viewport'
import { useDispatch } from 'react-redux'
import useClientRect from '../lib/useClientRect'
import { useGesture } from 'react-use-gesture'
import { moveWorkspace, zoomWorkspace } from './appShell'
import { normalizeZoomFactor } from '../lib/mouse-utils'

const STEP = 0.99
const MAX_SCALE = 5
const MIN_SCALE = 0.01

const Viewports = memo(() => {
    const viewports = useViewportsInCurrentWorkspace()
    if (!viewports) {
        return null
    }

    return (
        <>
            {viewports.map((viewport, index) => {
                return <Viewport viewport={viewport} index={index}></Viewport>
            })}
        </>
    )
})

export const Canvas = () => {
    const dispatch = useDispatch()
    const { x, y } = usePositionInCurrentWorkspace() || { x: 0, y: 0 }
    const zoom = useZoomInCurrentWorkspace() || 1
    const [zoomOffset, setZoomOffset] = useState([x, y])
    const [scaling, setScaling] = useState(zoom)

    useEffect(() => {
        if (zoom !== scaling) {
            setScaling(zoom)
        }
    }, [zoom])

    useEffect(() => {
        if (x !== zoomOffset[0] || y !== zoomOffset[1]) {
            setZoomOffset([x, y])
        }
    }, [x, y])

    const [wrapperRect, wrapperRef] = useClientRect()
    const contentRefDOM =
        typeof window !== 'undefined'
            ? document.getElementById('contentRefDOM')
            : null

    const originCenterX = wrapperRect
        ? wrapperRect.left + wrapperRect.width / 2
        : 0
    const originCenterY = wrapperRect
        ? wrapperRect.top + wrapperRect.height / 2
        : 0

    const bind = useGesture({
        onWheel: ({ last, delta, shiftKey }) => {
            if (shiftKey) {
                delta = [delta[1], delta[0]]
            }
            const xy = [zoomOffset[0] - delta[0], zoomOffset[1] - delta[1]]
            setZoomOffset(xy)
            if (last) {
                dispatch(moveWorkspace({ x: xy[0], y: xy[1] }))
            }
        },
        onDrag: ({ xy, initial, buttons, delta }) => {
            const [px, py] = xy
            const [ix, iy] = initial
            // if (creating?.status === 'waiting') {
            //     dispatch(
            //         startCreating({
            //             x: ix - x,
            //             y: iy - y,
            //         })
            //     )
            // } else if (creating?.status === 'updating') {
            //     dispatch(
            //         updateCreating({
            //             x: px - x,
            //             y: py - y,
            //         })
            //     )
            // }
            if (buttons === 4) {
                if (Math.abs(delta[0]) > 0 || Math.abs(delta[1]) > 0) {
                    const xy = [
                        zoomOffset[0] + delta[0],
                        zoomOffset[1] + delta[1],
                    ]
                    setZoomOffset(xy)
                }
            }
        },
        onMouseDown: (event) => {
            event.stopPropagation()
            if (event.buttons === 4) {
                event.preventDefault()
            }
        },
        onMouseUp: (event) => {
            // if (creating?.status !== 'updating') {
            //     return
            // }
            // dispatch(finishCreating())
        },
        onPinch: (e) => {
            const origin = e.origin
            let factor = normalizeZoomFactor(e)

            if (
                (scaling >= MAX_SCALE && factor < 0) ||
                (scaling <= MIN_SCALE && factor > 0)
            )
                return

            const changed = Math.pow(STEP, factor)

            const contentRect =
                contentRefDOM && contentRefDOM.getBoundingClientRect()
            const currentCenterX = contentRect
                ? contentRect.left + contentRect.width / 2
                : 0
            const currentCenterY = contentRect
                ? contentRect.top + contentRect.height / 2
                : 0

            const mousePosToCurrentCenterDistanceX = origin
                ? origin[0] - currentCenterX
                : 0
            const mousePosToCurrentCenterDistanceY = origin
                ? origin[1] - currentCenterY
                : 0

            const newCenterX =
                currentCenterX +
                mousePosToCurrentCenterDistanceX * (1 - changed)
            const newCenterY =
                currentCenterY +
                mousePosToCurrentCenterDistanceY * (1 - changed)

            const offsetX = newCenterX - originCenterX
            const offsetY = newCenterY - originCenterY

            setScaling(scaling * changed)
            setZoomOffset([offsetX, offsetY])

            if (e.last) {
                dispatch(moveWorkspace({ x: offsetX, y: offsetY }))
                dispatch(zoomWorkspace({ zoom: scaling }))
            }
        },
    })

    return (
        <div style={{ overflow: 'visible' }}>
            <div
                ref={wrapperRef}
                style={{
                    position: 'absolute',
                    height: '100vh',
                    width: '100vw',
                    background: '#f1f1f1',
                }}
                {...bind()}
                onDoubleClick={() => {
                    tick((data = []) => data)
                }}
            >
                <div
                    style={{
                        position: 'absolute',
                        width: '100vw',
                        height: '100vh',
                        transform: `translate(${zoomOffset[0]}px, ${zoomOffset[1]}px) scale(${scaling})`,
                    }}
                >
                    {<Viewports></Viewports>}
                </div>
            </div>
        </div>
    )
}
