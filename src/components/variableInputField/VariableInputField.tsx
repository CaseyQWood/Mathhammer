import { Select, Option, Input } from '@mui/joy'
import style from './variableInputField.module.css'
import { useEffect, useState } from 'react'

interface VariableInputFieldProps {
    title: string
    value: { variable: string; value: number }
    stateKey: string
    handleChange: (key: string, value: { variable: string; value: number }) => void
}

export default function VariableInputField({ title, stateKey, handleChange }: VariableInputFieldProps) {
    const [value, setValue] = useState({
        variable: "0",
        value: 1
    })

    const handleVariableChange = (
        _event: unknown,
        newVal: string | null,
    ) => {
        setValue(prev => ({
            ...prev,
            variable: newVal ?? prev.variable,
        }));
    };

    const handleValueChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const num = Number(e.target.value);
        setValue(prev => ({
            ...prev,
            value: Number.isNaN(num) ? prev.value : num,
        }));
    };


    useEffect(() => {
        handleChange(stateKey, value)
    }, [value, handleChange, stateKey])

    return (
        <div className={style.variableInput__wrapper}>
            <div>{title}</div>
            <div className={style.input__wrapper} >
                <Select
                    value={value.variable}
                    onChange={handleVariableChange}
                    size="md"
                    variant="outlined"
                    sx={{
                        width: '45%',
                        alignContent: 'center',
                        padding: '0.5rem'
                    }}
                >
                    <Option value="0">0</Option>
                    <Option value="D3">D3</Option>
                    <Option value="D6">D6</Option>
                </Select>
                <div className={style.plusSign}>
                    +
                </div>
                <Input
                    size="md"
                    variant="outlined"
                    type="number"
                    onFocus={e => e.target.select()}
                    value={value.value}
                    onChange={handleValueChange}
                    slotProps={{
                        input: {
                            min: 1,
                            max: 14,
                            step: 1,
                        },
                    }}
                    sx={{
                        width: '100%'
                    }}
                />
            </div>
        </div >)
}