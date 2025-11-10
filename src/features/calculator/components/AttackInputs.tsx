import type { AttackStats } from "@/types/unitStats";
import InputField from "@/components/ui/inputField/InputField";
import VariableInputField from "@/components/ui/variableInputField/VariableInputField";
import style from './unitForm.module.css'

interface AttackStatsProps {
    profileId: string
    attackStats: AttackStats
    handleAttackChange: (profileId: string, key: string, value: boolean | number | null | { variable: string; value: boolean | number; }) => void
}

export default function AttackInputs({ profileId, attackStats, handleAttackChange }: AttackStatsProps) {

    return (
        <div className={style.attackingStats__wrapper}>
            <InputField
                title="Models"
                value={attackStats.models}
                setValue={(value) => handleAttackChange(profileId, 'models', value)}
                min={1}
                max={20}
            />
            <VariableInputField
                profileId={profileId}
                stateKey="attacks"
                valueObject={attackStats.attacks}
                handleChange={handleAttackChange}
            />
            <div className={style.weaponStats}>
                <InputField
                    title="WS/BS"
                    value={attackStats.weaponSkill}
                    setValue={(value) => handleAttackChange(profileId, 'weaponSkill', value)}
                    min={2}
                    max={6}
                    width="100%"
                />
                <InputField
                    title="Strength"
                    value={attackStats.strength}
                    setValue={(value) => handleAttackChange(profileId, 'strength', value)}
                    min={1}
                    max={20}
                    width="100%"
                />
                <InputField
                    title="AP"
                    value={attackStats.armourPiercing}
                    setValue={(value) => handleAttackChange(profileId, 'armourPiercing', value)}
                    min={0}
                    max={6}
                    width="100%"
                />
            </div>
            <VariableInputField
                title='Damage'
                profileId={profileId}
                valueObject={attackStats.damage}
                stateKey="damage"
                handleChange={handleAttackChange}
            />
        </div>
    );
}
