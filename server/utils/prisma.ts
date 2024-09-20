import type { D1Database } from '@cloudflare/workers-types'
import { PrismaD1 } from '@prisma/adapter-d1'
import { PrismaClient } from '@prisma/client'

let _prisma: PrismaClient

export function usePrismaClient(db: D1Database) {
	return (_prisma ||= new PrismaClient({
		adapter: new PrismaD1(db),
	}))
}

export type DBClient = ReturnType<typeof usePrismaClient>
