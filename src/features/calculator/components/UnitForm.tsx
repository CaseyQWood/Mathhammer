import style from './unitForm.module.css'
import DropDown from "@/components/ui/dropDown/DropDown";
import DefenseInputs from './DefenseInputs'
import AttackInputs from "./AttackInputs";
import AttackModifiers from "./AttackModifiers";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import type { DefenseStats, AttackProfile } from "@/types/unitStats"


interface UnitFormProps {
    defenseStats: DefenseStats
    attackProfiles: AttackProfile[]
    handleDefenseChange: (key: string, value: number) => void
    handleAttackChange: (profileIndex: number, key: string, value: boolean | number | null | {
        variable: string;
        value: boolean | number;
    }) => void
    handleModifiersChange: (profileIndex: number, key: string, value: boolean | number | null | {
        variable: string | null;
        value: boolean | number;
    }) => void
    handleFormSubmit: () => void;
    handleAddAttackProfile: () => void;
}

export default function UnitForm({ defenseStats, attackProfiles, handleAddAttackProfile, handleDefenseChange, handleAttackChange, handleModifiersChange, handleFormSubmit }: UnitFormProps) {
    return (
        <div className={style.unitForm__wrapper} >
            <div className={style.unitInputs__wrapper}>
                <DropDown color="primary" title="Defence Stats">
                    <DefenseInputs defenseStats={defenseStats} handleDefenseChange={handleDefenseChange} />
                </DropDown>

                {attackProfiles.map((profile, index) => {
                    return (
                        <DropDown color="secondary" title="Attack Stats">
                            <div className={style.form} onClick={(e) => e.stopPropagation()}>
                                <AttackInputs index={Number(index)} attackStats={profile.attackStats} handleAttackChange={handleAttackChange} />
                                <AttackModifiers index={Number(index)} modifiers={profile.modifiers} handleModifiersChange={handleModifiersChange} />
                            </div>

                        </DropDown>
                    )
                })}
                <AddCircleOutlineIcon
                    onClick={() => {
                        console.log("click")
                        handleAddAttackProfile()
                    }}
                    className={style.addFormIcon}
                />
            </div>
            <button className={style.submitButton}
                onClick={() => {
                    handleFormSubmit()
                    console.log("submit")
                }}
            >
                Submit
            </button >
        </div >
    )
}
