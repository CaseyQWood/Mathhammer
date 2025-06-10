import { Select, Option } from '@mui/joy'
import InputField from '../inputField'
import style from './variableInputField.module.css'

interface VariableInputFieldProps {
    title: string
    value: number
    handleChange: (stat: string, value: number) => void
}

export default function VariableInputField({ title, value, handleChange }: VariableInputFieldProps) {
    return (
        <div className={style.variableInput__wrapper}>
            <div>{title}</div>
            <div className={style.input__wrapper} >
                <Select defaultValue="0"
                    size="md"
                    variant="outlined"
                    sx={{
                        width: 'auto',
                        alignContent: 'center',
                        padding: '0.5rem'
                    }}
                >
                    <Option value="0">0</Option>
                    <Option value="D3">D3</Option>
                    <Option value="D6">D6</Option>
                </Select>
                <div>
                    +
                </div>
                <InputField title="" value={value} setValue={(value) => handleChange('attacks', value)} min={0} max={150} />
            </div>
        </div >)
}