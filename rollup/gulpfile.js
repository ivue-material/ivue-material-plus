import {
  mkdir
} from 'fs/promises'

import {
  parallel,
  series
} from 'gulp'
import {
  outputPath,
} from './build-utils'
import {
  runTask,
  withTaskName
} from './src'

import {
  buildStyles
} from './src/tasks/build-styles'

export default series(
  withTaskName('createOutput', () => mkdir(outputPath, {
    recursive: true
  })),


  parallel(
    runTask('buildComponents'),
    series(buildStyles)
  ),
)

export * from './src'
