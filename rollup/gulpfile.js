import {
  mkdir
} from 'fs/promises'

import {
  parallel,
  series
} from 'gulp'
import {
  epOutput,
} from './build-utils'
import {
  runTask,
  withTaskName
} from './src'

export default series(
  withTaskName('createOutput', () => mkdir(epOutput, {
    recursive: true
  })),

  parallel(
    runTask('buildComponents'),
  ),
)

export * from './src'
