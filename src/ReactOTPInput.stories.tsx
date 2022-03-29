import React, { useState } from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { ReactOTPInput } from './'

export default {
	title: 'Example/React OTP Input',
	component: ReactOTPInput,
	argTypes: {},
	decorators: [
		(StoryFn) => {
			// mock state
			const [value, setValue] = useState('')
			const handleChange = (value: string) => {
				setValue(value)
			}

			return (
				<form action=''>
					<ReactOTPInput
						isPassword={false}
						value={value}
						onChange={handleChange}
						numFields={6}
						required
					/>
					<button type='submit'>Send</button>
				</form>
			)
		},
	],
} as ComponentMeta<typeof ReactOTPInput>

const Template: ComponentStory<typeof ReactOTPInput> = (args) => (
	<ReactOTPInput {...args} />
)

export const Primary = Template.bind({})
Primary.args = {
	numFields: 6,
}
