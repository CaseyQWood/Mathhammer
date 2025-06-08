import type { AttackStats } from "../../types/unitStats";
import InputField from "../inputField";
import { Option, Select } from "@mui/joy";
import style from './unitForm.module.css'

interface AttackStatsProps {
    attackStats: AttackStats
    handleAttackChange: (stat: keyof AttackStats, value: number) => void
}

export default function AttackInputs({ attackStats, handleAttackChange }: AttackStatsProps) {

    return (
        <div className={style.attackingStats__wrapper}>
            <InputField title="Models" value={attackStats.models} setValue={(value) => handleAttackChange('models', value)} min={1} max={20} />
            <div className='attacks__wrapper'>
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
                <InputField title="Attacks" value={attackStats.attacks} setValue={(value) => handleAttackChange('attacks', value)} min={0} max={150} />

            </div>

            <InputField title="WS/BS" value={attackStats.weaponSkill} setValue={(value) => handleAttackChange('weaponSkill', value)} min={2} max={6} />
            <InputField title="Strength" value={attackStats.strength} setValue={(value) => handleAttackChange('strength', value)} min={1} max={20} />
            <InputField title="Armour piercing" value={attackStats.armourPiercing} setValue={(value) => handleAttackChange('armourPiercing', value)} min={0} max={6} />
            <div
                className='damage__wrapper'
            >
                {/* <InputField title="" value={attackStats.variableDamage} setValue={(value) => handleAttackChange('variableDamage', value)} min={0} max={6} damageDecorator={true} /> */}
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
                <InputField title="Damage" value={attackStats.damage} setValue={(value) => handleAttackChange('damage', value)} min={0} max={10} />
            </div>
        </div>
    );
}
