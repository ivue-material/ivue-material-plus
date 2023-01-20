import { execSync } from 'child_process';
import fg from 'fast-glob';

const getPackages = (packagePath: string) =>
  fg.sync('*', { cwd: packagePath, onlyDirectories: true });

const gitStatus = execSync('git status --porcelain || true')
  .toString()
  .trim()
  .split('\n');

const scopeComplete = gitStatus
  .find((r) => ~r.indexOf('M  src'))
  ?.replace(/\//g, '%%')
  ?.match(/src%%((\w|-)*)/)?.[1];

const subjectComplete = gitStatus
  .find((r) => ~r.indexOf('M  src/components'))
  ?.replace(/\//g, '%%')
  ?.match(/src%%components%%((\w|-)*)/)?.[1];

const scopes = [
  ...getPackages('src'),
  'style',
  'dev',
  'typography',
  'typings',
  'rollup',
  'resolvers',
  'examples',
  'build'
];

export default {
  rules: {
    /**
     * 类型[作用域]: [功能] 描述
     *      ^^^^^
     *
     * 自定义选择 模块范围 命令行显示信息
     */
    'scope-enum': [2, 'always', scopes],
    /**
     * type[scope]: [function] description
     *
     * ^^^^^^^^^^^^^^ empty line.
     * - Something here
     */
    'body-leading-blank': [1, 'always'],
    /**
     * type[scope]: [function] description
     *
     * - something here
     *
     * ^^^^^^^^^^^^^^
     */
    'footer-leading-blank': [1, 'always'],
    /**
     * type[scope]: [function] description [No more than 120 characters]
     *      ^^^^^
     */
    'header-max-length': [2, 'always', 120],
    'scope-case': [2, 'always', 'lower-case'],
    'subject-case': [
      1,
      'never',
      ['sentence-case', 'start-case', 'pascal-case', 'upper-case'],
    ],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    /**
     * type[scope]: [function] description
     * ^^^^
     */
    'type-enum': [
      2,
      'always',
      [
        'build',
        'chore',
        'ci',
        'docs',
        'feat',
        'fix',
        'perf',
        'refactor',
        'revert',
        'release',
        'style',
        'test',
        'improvement',
      ],
    ],
  },
  prompt: {
    // 如果 defaultScope 与在选择范围列表项中的 value 相匹配就会进行星标置顶操作
    defaultScope: scopeComplete,
    // 设置 选择范围 中 为空选项(empty) 和 自定义选项(custom) 的 位置
    customScopesAlign: !scopeComplete ? 'top' : 'bottom',
    // 设置 选择范围 中 为空选项(empty) 和 自定义选项(custom) 的 位置
    defaultSubject: subjectComplete && `[${subjectComplete}] `,
    // 是否在选择 ISSUE 前缀 显示自定义选项(custom)
    allowCustomIssuePrefix: false,
    // 是否在选择 ISSUE 前缀 显示为跳过选项(skip)
    allowEmptyIssuePrefix: false,
  },
};
