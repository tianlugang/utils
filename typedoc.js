// const git = require('git-rev-sync');

module.exports = {
  exclude: [
    // '^((?!index\.ts).)*$',
    // '^((?!index\.tsx).)*$',
    // '**/*+(__tests__|internal|lib|node_modules|demos)/**/*',

    '.history',
    '**/.storybook',
    '**/babel.config.js',
    '**/*.spec.ts*',
    '**/*.stories.ts*',
    '**/build-utils/**',
    '**/docs/**',
    '**/examples/**',
    // '**/lib/**',
    '**/node_modules/**',
    '**/tests/**'
  ],
  excludeNotExported: true,
  ignoreCompilerErrors: false,
  mode: 'library',
  name: '@tlg',
  out: 'docs/api',
  readme: 'README.md',
  theme: 'typedoc-theme',
  tsconfig: 'tsconfigdoc.json'

  // gitRevision: 'master',
  // 'sourcefile-url-prefix': `https://github.com/sinnerschrader/feature-hub/tree/${git.short()}/packages/`,
};
