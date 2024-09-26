<script setup lang="ts">
const tab = ref('login')
</script>

<template>
	<div class="pt-16 md:pt-32">
		<Tabs v-model="tab" class="mx-auto box-border max-w-full w-[400px] px-1">
			<TabsList class="grid grid-cols-2 w-full">
				<TabsTrigger value="login">
					{{ $text.login() }}
				</TabsTrigger>
				<TabsTrigger value="register">
					{{ $text.signUp() }}
				</TabsTrigger>
			</TabsList>
			<TabsContent value="login">
				<FormLogin />
			</TabsContent>
			<TabsContent value="register">
				<FormRegister @success="() => (tab = 'login')" />
			</TabsContent>
		</Tabs>
	</div>
</template>
