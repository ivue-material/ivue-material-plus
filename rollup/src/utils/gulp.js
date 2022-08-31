import {
  buildRoot
} from '../../build-utils'
import {
  run
} from './process'

// 运行任务名称
export const withTaskName = (name, fn) =>
  Object.assign(fn, {
    displayName: name
  })

// 运行任务
export const runTask = (name) =>
  withTaskName(`shellTask:${name}`, () =>
    run(`pnpm run start ${name}`, buildRoot)
  )
