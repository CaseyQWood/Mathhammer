import { Select, Option, Input } from '@mui/joy'
import style from './variableInputField.module.css'
import { useEffect, useState } from 'react'

interface VariableInputFieldProps {
    profileId: string;
    title?: string;
    valueObject: {
        variable: string;
        value: number;
    }
    stateKey: string;
    handleChange: (profileId: string, key: string, value: boolean | number | null | { variable: string; value: boolean | number; }) => void
}
const options = [
    { value: "0" },
    { value: "D3" },
    { value: "2D3" },
    { value: "3D3" },
    { value: "D6" },
    { value: "2D6" },
    { value: "3D6" },

]

export default function VariableInputField({ profileId, title, valueObject, stateKey, handleChange }: VariableInputFieldProps) {

    const [value, setValue] = useState(valueObject)

    const handleVariableChange = (
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
        e.preventDefault()
        const num = Number(e.target.value);
        setValue(prev => ({
            ...prev,
            value: Number.isNaN(num) ? prev.value : num,
        }));
    };

    useEffect(() => {
        setValue(valueObject);
    }, [valueObject]);


    useEffect(() => {
        handleChange(profileId, stateKey, value)
    }, [value, handleChange, stateKey, profileId])

    return (
        <div className={style.variableInput__wrapper}>
            <div>{title}</div>
            <div className={style.input__wrapper} >
                <Select
                    value={value.variable}
                    onChange={(e, newVal) => {
                        e?.stopPropagation()
                        handleVariableChange(newVal)
                    }}
                    size="md"
                    variant="outlined"
                    sx={{
                        width: '45%',
                        alignContent: 'center',
                        padding: '0.5rem'
                    }}
                >
                    {options.map((ele, index) => {
                        return <Option key={`${ele.value}--${index}`} value={ele.value} >{ele.value}</Option>
                    })}
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
                    onChange={(e) => {
                        console.log("variable field INPUT: ", e)
                        handleValueChange(e)
                    }}
                    slotProps={{
                        input: {
                            min: 0,
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