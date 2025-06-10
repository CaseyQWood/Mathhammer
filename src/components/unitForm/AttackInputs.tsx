import type { AttackStats } from "../../types/unitStats";
import InputField from "../inputField";
import VariableInputField from "../variableInputField";
import style from './unitForm.module.css'

interface AttackStatsProps {
    attackStats: AttackStats
    handleAttackChange: (stat: string, value: number) => void
}

export default function AttackInputs({ attackStats, handleAttackChange }: AttackStatsProps) {

    return (
        <div className={style.attackingStats__wrapper}>
            <InputField
                title="Models"
                value={attackStats.models}
                setValue={(value) => handleAttackChange('models', value)}
                min={1}
                max={20}
            />
            <VariableInputField title='attacks' value={attackStats.attacks} handleChange={handleAttackChange} />
            <InputField title="WS/BS" value={attackStats.weaponSkill} setValue={(value) => handleAttackChange('weaponSkill', value)} min={2} max={6} />
            <InputField title="Strength" value={attackStats.strength} setValue={(value) => handleAttackChange('strength', value)} min={1} max={20} />
            <InputField title="Armour piercing" value={attackStats.armourPiercing} setValue={(value) => handleAttackChange('armourPiercing', value)} min={0} max={6} />
            <VariableInputField title='damage' value={attackStats.damage} handleChange={handleAttackChange} />
        </div>
    );
}
