import React, { useEffect, useState } from 'react'
import { uuid4 } from './utils/uuid4'
export interface IReactOTPInputProps {
	numFields: number
	onChange: (value: string) => void
	value?: string
	isPassword: boolean
}
/**
 * React component for entering and validating PIN code.
 */
function ReactOTPInput(props: IReactOTPInputProps) {
	let { numFields = 5, onChange, value, isPassword = false } = props
	const [input, setInput] = useState(new Array(numFields).fill('') as any[])
	const [activeField, setActiveField] = useState(-1)

	let fields = [] as any[]

	const handleChange = (e: any) => {
		let value = e.target.value // char
		const target = Number(e.target.dataset.id)
		let newInput = input // copy
		newInput[target] = value
		setInput(newInput)
		const nextField =
			fields[
				e.target.dataset.id < numFields
					? Number(e.target.dataset.id) + 1
					: e.target.dataset.id
			]
		let fullValue = input.join('')
		if (nextField) {
			nextField.focus()
			nextField.select()
		}

		onChange(fullValue)
	}

	function handleKeyDown(e: any) {
		const target = Number(e.target.dataset.id),
			nextField = fields[target + 1],
			prevField = fields[target - 1]
		switch (e.keyCode) {
			case 8: // backspace
				e.preventDefault()
				fields[target].value = ''
				input[target] = ''
				setInput([...input])
				if (target > 0) {
					prevField.focus()
					prevField.select()
				}
				onChange(input.join(''))
				break
			case 37: // left
				e.preventDefault()
				if (target > 0) {
					prevField.focus()
					prevField.select()
				}

				break
			case 39: // right
				e.preventDefault()
				if (target < numFields - 1) {
					nextField.focus()
					nextField.select()
				}
				break
			default:
				break
		}
	}

	function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
		e.preventDefault()
		let nextActiveInput = activeField
		const pastedData = e.clipboardData
			.getData('text/plain')
			.slice(0, numFields - activeField) // 1234567
			.split('')
		console.log(pastedData)

		let newInput = input
		// activeField = 2 // numFields = 6
		for (let i = activeField; i < numFields; i++) {
			if (i <= numFields - 1) {
				// 5
				const v = pastedData.shift()
				console.log(v)

				fields[i].value = v
				newInput[i] = v
			}
		}
		setInput([...newInput])
		onChange(newInput.join(''))

		fields[numFields - 1].focus()
		fields[numFields - 1].select()
	}

	return (
		<div className='otp-container'>
			{input.map((_, i) => (
				<input
					ref={(el) => {
						fields[i] = el
					}}
					className='otp-input'
					id={`${uuid4()}-${i}`}
					data-id={i}
					maxLength={1}
					key={i}
					onPaste={(e) => handlePaste(e)}
					onChange={(e) => handleChange(e)}
					onKeyDown={(e) => handleKeyDown(e)}
					onFocus={(e) => {
						setActiveField(i)
						e.target.select()
					}}
					onBlur={(e) => setActiveField(-1)}
					type={isPassword ? 'password' : 'text'}
				/>
			))}
		</div>
	)
}

ReactOTPInput.displayName = 'ReactOTPInput'

export default ReactOTPInput
