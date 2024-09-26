<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { toast } from 'vue-sonner'

const props = defineProps<{
	onSuccess: () => void
}>()
const { $text, $trpc } = useNuxtApp()
const loading = ref(false)

const registerFormSchema = toTypedSchema(UserRegisterInputFormValidator)
const form = useForm({
	validationSchema: registerFormSchema,
})

const onSubmit = form.handleSubmit(async ({ confirmPassword, password, no, username, email }) => {
	if (confirmPassword !== password) {
		form.setFieldError('confirmPassword', $text.passwordNotMatch())
		return
	}
	loading.value = true
	$trpc.user.register
		.mutate({
			no,
			username,
			email,
			password,
		})
		.then(() => {
			toast($text.successfullyRegistered(), {
				description: $text.pleaseLogInWithYourAccountAndPassword(),
			})
			props.onSuccess()
		})
		.finally(() => {
			loading.value = false
		})
})
</script>

<template>
	<Card>
		<CardHeader>
			<CardTitle>{{ $text.signUp() }}</CardTitle>
		</CardHeader>
		<form @submit="onSubmit">
			<CardContent class="space-y-2">
				<FormField v-slot="{ componentField }" name="username">
					<FormItem v-auto-animate>
						<FormLabel>{{ $text.username() }}</FormLabel>
						<FormControl>
							<Input v-bind="componentField" />
						</FormControl>
						<FormMessage />
					</FormItem>
				</FormField>
				<FormField v-slot="{ componentField }" name="no">
					<FormItem v-auto-animate>
						<FormLabel>{{ $text.studentNo() }}</FormLabel>
						<FormControl>
							<Input v-bind="componentField" />
						</FormControl>
						<FormMessage />
					</FormItem>
				</FormField>
				<FormField v-slot="{ componentField }" name="email">
					<FormItem v-auto-animate>
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
				<FormField v-slot="{ componentField }" name="confirmPassword">
					<FormItem>
						<FormLabel>{{ $text.confirmPassword() }}</FormLabel>
						<FormControl>
							<Input type="password" v-bind="componentField" />
						</FormControl>
						<FormMessage />
					</FormItem>
				</FormField>
			</CardContent>
			<CardFooter>
				<Button type="submit" :loading="loading">
					{{ $text.signUp() }}
				</Button>
			</CardFooter>
		</form>
	</Card>
</template>
