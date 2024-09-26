<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { isArray } from 'lodash-es'
import { useForm } from 'vee-validate'
import { toast } from 'vue-sonner'

const { $trpc, $text, $router } = useNuxtApp()
const route = useRoute()
const loading = ref(false)
const auth = useAuthStore()
const loginFormSchema = toTypedSchema(UserLoginSubmitFormValidator)
const form = useForm({
	validationSchema: loginFormSchema,
})

const onSubmit = form.handleSubmit(async (values) => {
	loading.value = true
	try {
		const userInfo = await $trpc.user.login.mutate(values)
		auth.updateUserInfo(userInfo)
		let redirect = route.query.from
		if (isArray(redirect) && redirect[0]) {
			redirect = redirect[0]
		}
		$router.replace((redirect as string) || '/')
	}
	catch {
		toast($text.error.loginFailed())
	}
	finally {
		loading.value = false
	}
})
</script>

<template>
	<Card>
		<CardHeader>
			<CardTitle>{{ $text.login() }}</CardTitle>
		</CardHeader>
		<form @submit="onSubmit">
			<CardContent class="space-y-2">
				<FormField v-slot="{ componentField }" name="email">
					<FormItem>
						<FormLabel>{{ $text.email() }}</FormLabel>
						<FormControl>
							<Input type="email" v-bind="componentField" />
						</FormControl>
						<FormMessage />
					</FormItem>
				</FormField>
				<FormField v-slot="{ componentField }" name="password">
					<FormItem>
						<FormLabel>{{ $text.password() }}</FormLabel>
						<FormControl>
							<Input type="password" v-bind="componentField" />
						</FormControl>
						<FormMessage />
					</FormItem>
				</FormField>
				<FormField v-slot="{ value, handleChange }" name="remember">
					<div class="flex items-center gap-x-2 pt-2">
						<FormLabel>{{ $text.rememberMe() }}</FormLabel>
						<FormControl>
							<Switch :checked="value" @update:checked="handleChange" />
						</FormControl>
						<FormMessage />
					</div>
				</FormField>
			</CardContent>
			<CardFooter>
				<Button type="submit" :loading="loading">
					{{ $text.login() }}
				</Button>
			</CardFooter>
		</form>
	</Card>
</template>
