import style from './unitForm.module.css'
import DropDown from "../dropDown/DropDown";
import DefenseInputs from './DefenseInputs'
import AttackInputs from "./AttackInputs";
import AttackModifiers from "./AttackModifiers";
import type { DefenseStats, AttackStats, Modifiers } from "../../types/unitStats"


interface UnitFormProps {
    defenseStats: DefenseStats
    attackStats: AttackStats[]
    modifiers: Modifiers[]
    handleDefenseChange: (key: string, value: number) => void
    handleAttackChange: (profileIndex: number, key: string, value: boolean | number | null | {
        variable: string;
        value: boolean | number;
    }) => void
    handleModifiersChange: (profileIndex: number, key: string, value: boolean | number | null | {
        variable: string | null;
        value: boolean | number;
    }) => void
}

export default function UnitForm({ defenseStats, attackStats, modifiers, handleDefenseChange, handleAttackChange, handleModifiersChange }: UnitFormProps) {

    return (
        <div className={style.unitForm__wrapper} >
            <div className={style.dropDown__wrapper}>
                <DropDown color="primary" title="Defence Stats">
                    <DefenseInputs defenseStats={defenseStats} handleDefenseChange={handleDefenseChange} />
                </DropDown>

                {attackStats.map((ele, index) => {
                    return (
                        <DropDown color="secondary" title="Attack Stats">
                            <div>
                                <AttackInputs index={Number(index)} attackStats={ele} handleAttackChange={handleAttackChange} />
                                <AttackModifiers index={Number(index)} modifiers={modifiers[index]} handleModifiersChange={handleModifiersChange} />
                            </div>
                        </DropDown>
                    )
                })}
            </div>
        </div >
    )
}
