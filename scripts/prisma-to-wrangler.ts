import { execFileSync } from 'node:child_process'
/* eslint-disable no-console */
import * as fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import prompts from 'prompts'

const root = path.resolve(__dirname, '..')
const projectPath = root
const schemaPath = path.join(root, 'prisma/schema.prisma')
const migratePath = path.resolve(root, './prisma/migrations')
const wranglerPath = path.resolve(
	projectPath,
	'.wrangler/state/v3/d1/miniflare-D1DatabaseObject',
)

let isInit = false
if (!fs.existsSync(migratePath)) {
	fs.mkdirSync(migratePath)
	isInit = true
}
if (fs.readdirSync(migratePath).length === 0) {
	isInit = true
}
else if (
	(!fs.existsSync(wranglerPath))
	|| fs.readdirSync(wranglerPath).length === 0
) {
	console.log('迁移记录存在，但是数据库不存在，将会自动创建数据库...')
	toProjectRootCwd(() => {
		execFileSync('pnpm', [ 'db:apply:local' ], {
			stdio: 'inherit',
		})
	})
}

let sql: string
if (isInit) {
	sql = execFileSync(
		'pnpm',
		[ 'prisma', 'migrate', 'diff', '--script', '--from-empty', '--to-schema-datamodel', schemaPath ],
		{ encoding: 'utf-8' },
	)
}
else {
	sql = toProjectRootCwd(() =>
		execFileSync(
			'pnpm',
			[ 'prisma', 'migrate', 'diff', '--script', '--from-local-d1', '--to-schema-datamodel', schemaPath ],
			{ encoding: 'utf-8' },
		),
	)
}

// 当没生成有效的sql语句时不写入
if (
	sql
		.trim()
		.split('\n')
		.filter(line => !line.startsWith('--'))
		.length === 0
) {
	console.log('No changes detected. Skip!')
	process.exit(0)
}

const { name } = await prompts(
	{
		type: 'text',
		name: 'name',
		message: 'Enter migration name',
		validate: v => v.length > 0 && /^\w*$/.test(v),
	},
	{
		onCancel() {
			console.log('Aborted!')
			process.exit(0)
		},
	},
)

const now = Date.now()
const filePath = path.join(migratePath, `${[ now, name ].join('_')}.sql`)

fs.writeFileSync(filePath, sql)
console.log('Done!')
console.log('locate:', filePath)

function toProjectRootCwd<T>(callback: () => T): T {
	const cwd = process.cwd()
	process.chdir(projectPath)
	const ret = callback()
	process.chdir(cwd)
	return ret
}
