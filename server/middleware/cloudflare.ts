import type { D1Database } from '@cloudflare/workers-types'
import type { H3EventContext } from 'h3'

declare module 'h3' {
	interface H3EventContext {
		cloudflare: {
			env: Env
		}
	}
}

interface Env {
	DB: D1Database
}

let cloudflare: H3EventContext['cloudflare']

export default defineEventHandler(async ({ context }) => {
	cloudflare ||= context.cloudflare
	context.cloudflare = cloudflare
})
