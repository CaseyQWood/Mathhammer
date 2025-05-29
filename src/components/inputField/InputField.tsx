import { Input } from '@mui/joy';
import "./inputField.module.css"

interface InputProps {
    title: string;
    value: number;
    min: number;
    max: number;
    damageDecorator?: boolean;
    setValue: (value: number) => void;
}

function stripNonNumbers(input: string): string {
    return input.replace(/\D+/g, '');
}

export default function InputField({ title, value, setValue, min, max, damageDecorator }: InputProps) {
    const decorator = damageDecorator ? "damage" : "none"

    function handleChange(input: string, min: number, max: number) {
        const strippedInput = stripNonNumbers(input)
        let finalInput: number = 0

        if (Number(strippedInput) > max) {
            finalInput = max
        } else if (Number(strippedInput) < min) {
            finalInput = min
        } else {
            finalInput = Number(strippedInput)
        }

        setValue(finalInput)
    }

    return (
        <div className='stat-input'>
            <h4>{title}</h4>
            <Input
                size="md"
                variant="outlined"
                placeholder="Toughness"
                type="number"
                startDecorator={{ damage: 'D|', none: null }[decorator]}
                onFocus={e => e.target.select()}
                value={value}
                onChange={(e) => handleChange(e.target.value, min, max)}
                slotProps={{
                    input: {
                        min: 1,
                        max: 14,
                        step: 1,
                    },
                }}
            />
        </div>
    )
}