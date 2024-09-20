import type { H3Event } from 'h3'
import { isNil } from 'lodash-es'

export async function createContext(event: H3Event) {
	const config = useRuntimeConfig()
	const token = getCookie(event, 'auth-token')
	const decoded = token && (await verifyToken(token))
	const db = usePrismaClient(event.context.cloudflare.env.DB)
	if (decoded) {
		const { payload } = decoded
		if (
			payload.remember
			&& !isNil(payload.exp)
			&& payload.exp - Date.now() / 1000 < 3 * 24 * 60 * 60
		) {
			// re-sign token
			const token = await signToken(payload.data)
			setCookie(event, 'auth-token', token, {
				httpOnly: true,
				maxAge: secs(config.OAUTH_EXPIRES_IN),
			})
		}
		return {
			db,
			event,
			userId: payload.data.userId,
		}
	}
	return {
		db,
		event,
	}
}

export type Context = Awaited<ReturnType<typeof createContext>>
