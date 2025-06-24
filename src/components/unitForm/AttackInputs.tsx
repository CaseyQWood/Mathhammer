import type { AttackStats } from "../../types/unitStats";
import InputField from "../inputField";
import VariableInputField from "../variableInputField";
import style from './unitForm.module.css'

interface AttackStatsProps {
    index: number
    attackStats: AttackStats
    handleAttackChange: (index: number, key: string, value: boolean | number | null | { variable: string; value: boolean | number; }) => void
}

export default function AttackInputs({ index, attackStats, handleAttackChange }: AttackStatsProps) {

    return (
        <div className={style.attackingStats__wrapper}>
            <div className={style.modelsInput}>
                <InputField
                    title="Models"
                    value={attackStats.models}
                    setValue={(value) => handleAttackChange(index, 'models', value)}
                    min={1}
                    max={20}
                />
            </div>
            <VariableInputField
                title='Attacks'
                index={index}
                stateKey="attacks"
                handleChange={handleAttackChange}
            />
            <InputField
                title="WS/BS"
                value={attackStats.weaponSkill}
                setValue={(value) => handleAttackChange(index, 'weaponSkill', value)}
                min={2}
                max={6}
            />
            <InputField
                title="Strength"
                value={attackStats.strength}
                setValue={(value) => handleAttackChange(index, 'strength', value)}
                min={1}
                max={20}
            />
            <InputField
                title="AP"
                value={attackStats.armourPiercing}
                setValue={(value) => handleAttackChange(index, 'armourPiercing', value)}
                min={0}
                max={6}
            />
            <VariableInputField
                title='Damage'
                index={index}
                // value={attackStats.damage}
                stateKey="damage"
                handleChange={handleAttackChange}
            />
        </div>
    );
}
