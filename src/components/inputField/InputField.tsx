import { Input, FormLabel } from '@mui/joy';
import styles from "./inputField.module.css"

interface InputProps {
    title: string;
    value: number;
    min: number;
    max: number;
    setValue: (value: number) => void;
}

function stripNonNumbers(input: string): string {
    return input.replace(/\D+/g, '');
}

export default function InputField({ title, value, setValue, min, max }: InputProps) {

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
        <div className={styles.inputField__wrapper}>
            <FormLabel sx={{ marginBottom: '0.5rem' }}>{title}</FormLabel>
            <Input
                size="md"
                variant="outlined"
                type="number"
                onFocus={e => e.target.select()}
                value={value}
                onChange={(e) => handleChange(e.target.value, min, max)}
                slotProps={{
                    input: {
                        min: 0,
                        max: 20,
                        step: 1,
                    },
                }}
                sx={{
                    width: '100%'
                }}
            />
        </div>
    )
}