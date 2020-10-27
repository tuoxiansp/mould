import { Path } from './types'

export const viewportPathToString = (path: Path) => path[0] + ''

export const pathToString = (path: Path) => path[0] + '/' + path[1].join('-')
