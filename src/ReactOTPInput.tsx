import React, { useEffect, useState } from 'react';
import { uuid4 } from './utils/uuid4';
import './styles/index.css';
import { ariaAttr } from './utils/dom';
export interface IReactOTPInputProps {
	/**
	 * Number of fields to be displayed.
	 * @default 5
	 */
	numFields?: number;
	onChange: (value: string) => void;
	/**
	 * Value of the otp input.
	 */
	value?: string;
	/**
	 * if true, the otp input will be a password input.
	 * @default false
	 */
	isPassword: boolean;
	/**
	 * if true, the otp input will be required.
	 * @default false
	 */
	required?: boolean;
	/**
	 *
	 */
	placeholder?: string;

	type?: 'text' | 'number';
	/**
	 * if true, the otp input will be disabled.
	 * @default false
	 * @see https://mui.com/material-ui/react-text-field/#main-content
	 */
	error?: boolean;
}

/**
 * React component for entering and validating PIN code.
 */
function ReactOTPInput(props: IReactOTPInputProps) {
	let {
		numFields = 5,
		onChange,
		value,
		required,
		isPassword = false,
		placeholder = '○',
		type = 'text',
		error = false,
	} = props;
	const [input, setInput] = useState(new Array(numFields).fill('') as any[]);
	const [activeField, setActiveField] = useState(-1);

	let fields = [] as any[];
	// TODO: Handler Chnage
	const handleChange = (e: any) => {
		let value = e.target.value;
		const target = Number(e.target.dataset.id);
		let newInput = input;
		newInput[target] = value;
		setInput(newInput);
		const nextField =
			fields[
				e.target.dataset.id < numFields
					? Number(e.target.dataset.id) + 1
					: e.target.dataset.id
			];
		let fullValue = input.join('');
		if (nextField) {
			nextField.focus();
			nextField.select();
		}

		onChange(fullValue);
	};
	// TODO :  Keys handler
	function handleKeyDown(e: any) {
		const target = Number(e.target.dataset.id),
			nextField = fields[target + 1],
			prevField = fields[target - 1];
		switch (e.keyCode) {
			case 8: // backspace
				e.preventDefault();
				fields[target].value = '';
				input[target] = '';
				setInput([...input]);
				if (target > 0) {
					prevField.focus();
					prevField.select();
				}
				onChange(input.join(''));
				break;
			case 37: // left
				e.preventDefault();
				if (target > 0) {
					prevField.focus();
					prevField.select();
				}

				break;
			case 39: // right
				e.preventDefault();
				if (target < numFields - 1) {
					nextField.focus();
					nextField.select();
				}
				break;
			default:
				break;
		}
	}
	// TODO : past handler
	function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
		e.preventDefault();
		const pastedData = e.clipboardData
			.getData('text/plain')
			.slice(0, numFields - activeField)
			.split('');

		let newInput = input;

		for (let i = activeField; i < numFields; i++) {
			if (i <= numFields - 1) {
				const v = pastedData.shift();
				fields[i].value = v;
				newInput[i] = v;
			}
		}
		setInput([...newInput]);
		onChange(newInput.join(''));

		fields[numFields - 1].focus();
		fields[numFields - 1].select();
	}

	return (
		<div className='otp-container'>
			{input.map((_, i) => (
				<input
					key={i}
					ref={(el) => {
						fields[i] = el;
					}}
					aria-label='Please enter your pin code'
					aria-invalid={ariaAttr(error)}
					className='otp-input error'
					inputMode={type === 'number' ? 'numeric' : 'text'}
					required={true}
					id={`input-${numFields}-${i + 1}`}
					data-id={i}
					maxLength={1}
					placeholder={activeField === i ? '' : placeholder}
					value={input[i] || ''}
					onPaste={(e) => handlePaste(e)}
					onChange={(e) => handleChange(e)}
					onKeyDown={(e) => handleKeyDown(e)}
					onFocus={(e) => {
						setActiveField(i);
						e.target.select();
					}}
					onBlur={() => setActiveField(-1)}
					type={isPassword ? 'password' : 'text'}
					autoComplete='off'
				/>
			))}
		</div>
	);
}

ReactOTPInput.displayName = 'ReactOTPInput';

export default ReactOTPInput;
