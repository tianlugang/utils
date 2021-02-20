import commander from 'commander'
import { logger } from '@tlg/utils'
import { deployer, soldierConfigMerged, soldier, toy } from '@tlg/builder'
import pkgJson from '../package.json'

process.on('unhandledRejection', error => {
    throw error
})

logger.setup(loggerOption => {
    soldierConfigMerged(loggerOption)
})

commander.version(pkgJson.version, '-v, --version')
commander.command('config')
    .description('Using configuration management.')
    .option('-r, --repo-host <url>', 'Set default repository server url.')
    .option('-u, --username <name>', 'Set package author name, it is your name.')
    .option('-b, --blog-url <blog-url>', 'Set your blog address.')
    .option('-e, --email <address>', 'Set your email address.')
    .option('-s, --npm-scope <short-name>', 'Scope of NPM packets.')
    .option('-l, --log-level <lv>', 'Set console log level.')
    .option('-a, --all [all]', 'See target value in config.')
    .action(soldier.config)

commander.command('init <name>')
    .description('create an empty project for template.')
    .option('-r, --repo-host <url>', 'Repository server url, default: [your config].')
    .option('-n, --no-npm-scope', 'Does not use npm package scope.')
    .option('-s, --npm-scope <scope>', 'Set current project is a scoped npm package.')
    .option('-w, --no-nodejs', 'It is not a nodejs project.')
    .option('-t, --template <templateId|gitRepoURL|gitRepoName|URL>', 'It is (Template-Id) or (git-repo-URL) or (git-repo-name) or URL or (Local-Dir-Path), If it is URL, Please specify the full download address.')
    .action(soldier.init)

commander
    .command('template [name]')
    .description('project template management, default: list all internally supported..')
    .option('-n, --link <url>', 'Custom project template, require a param: git repository or absolute disk dir path.')
    .option('-r, --rm-link <url>', 'Remove project template, require template name.')
    .option('-l, --list', 'Display template list.')
    .action(soldier.template)

commander.command('toy:ts-vue2 <name>')
    .description('project use `typescript` and `vue2`.')
    .option('-p, --is-page', 'create a page, it include: router/vuex')
    .option('-c, --is-component', 'create a vue2-sfc component.')
    .option('-m, --is-module', 'create a Business module. ')
    .action(toy.tsAndVUE2)

commander.command('toy <name>')
    .description('Use custom templates to generate code')
    .option('-t, --template <path>', 'Template path or template directory path.')
    .option('-s, --src <path>', 'Working source directory.')
    .action(toy.general)

commander.command('toy-shared')
    .description('Synchronization package information.')
    .option('-s, --sync-info', 'Synchronous subcontracting information.')
    .action(toy.syncPackageInfo)

commander.command('dep <version>')
    .description('publish $version to remote server.')
    .action(deployer.publish)

commander.command('dep-list')
    .description('list released version on remote server.')
    .alias('ls')
    .action(deployer.listVersions)

commander.command('dep-rm <version>')
    .description('remove released version on remote server.')
    .action(deployer.removeVersion)

commander.command('dep-exec')
    .description('run scripts on remote server.')
    .action(deployer.runScripts)

commander.parse(process.argv)
