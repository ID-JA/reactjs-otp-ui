import React, { useState } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ReactOTPInput } from './';

export default {
	title: 'Example/React OTP Input',
	component: ReactOTPInput,
	argTypes: {},
	decorators: [
		(StoryFn) => {
			// mock state
			const [value, setValue] = useState('');
			const handleChange = (value: string) => {
				setValue(value);
			};
			const handleSubmit = (e: React.MouseEvent<HTMLFormElement>) => {
				e.preventDefault();
				console.log('submit', value);
			};

			return (
				<form
					onSubmit={(e: React.MouseEvent<HTMLFormElement>) => handleSubmit(e)}>
					<ReactOTPInput
						isPassword={true}
						value={value}
						onChange={handleChange}
						numFields={6}
						required
					/>
					<button type='submit'>Send</button>
				</form>
			);
		},
	],
} as ComponentMeta<typeof ReactOTPInput>;

const Template: ComponentStory<typeof ReactOTPInput> = (args) => (
	<ReactOTPInput {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
	numFields: 6,
};
