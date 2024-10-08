import * as z from 'zod'

export const PasswordValidator = z.string().min(6)

export const BasicUserRegisterFormValidator = z.object({
	username: z.string().min(2),
	no: z.number().min(1),
	email: z.string().email(),
	password: PasswordValidator,
})

export const UserRegisterInputFormValidator = z.object({
	confirmPassword: PasswordValidator,
}).and(BasicUserRegisterFormValidator)

export const UserRegisterSubmitDataValidator = BasicUserRegisterFormValidator

export const UserLoginSubmitFormValidator = z.object({
	email: z.string().email(),
	password: PasswordValidator,
	remember: z.boolean().optional(),
})
