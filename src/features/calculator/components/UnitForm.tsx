import { useState } from 'react'
import style from './unitForm.module.css'
import DropDown from "@/components/ui/dropDown/DropDown";
import DefenseInputs from './DefenseInputs'
import AttackInputs from "./AttackInputs";
import AttackModifiers from "./AttackModifiers";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveIcon from '@mui/icons-material/Remove';
import type { DefenseStats, AttackProfile } from "@/types/unitStats"


interface UnitFormProps {
    defenseStats: DefenseStats
    attackProfiles: AttackProfile[]
    handleDefenseChange: (key: string, value: number) => void
    handleAttackChange: (profileId: string, key: string, value: boolean | number | null | {
        variable: string;
        value: boolean | number;
    }) => void
    handleModifiersChange: (profileId: string, key: string, value: boolean | number | null | {
        variable: string | null;
        value: boolean | number;
    }) => void
    handleFormSubmit: () => void;
    handleAddAttackProfile: () => void;
    handleRemoveAttackProfile: (id: string) => void;
}

export default function UnitForm({ defenseStats, attackProfiles, handleAddAttackProfile, handleRemoveAttackProfile, handleDefenseChange, handleAttackChange, handleModifiersChange, handleFormSubmit }: UnitFormProps) {
    const [openDropdowns, setOpenDropdowns] = useState<Set<string>>(new Set())

    const handleDropdownToggle = (profileId: string) => {
        setOpenDropdowns(prev => {
            const newSet = new Set(prev)
            if (newSet.has(profileId)) {
                newSet.delete(profileId)
            } else {
                newSet.add(profileId)
            }
            return newSet
        })
    }

    return (
        <div className={style.unitForm__wrapper} >
            <div className={style.unitInputs__wrapper}>
                <DropDown color="primary" title="Defence Stats">
                    <DefenseInputs defenseStats={defenseStats} handleDefenseChange={handleDefenseChange} />
                </DropDown>

                {attackProfiles.map((profile, index) => {
                    const isDropdownOpen = openDropdowns.has(profile.id)
                    return (
                        <div key={profile.id} style={isDropdownOpen ? { display: "inline" } : { display: "flex" }} className={style.attackProfile}>
                            {
                                index != 0 && !isDropdownOpen ? <div className={style.minus}><RemoveIcon onClick={() => handleRemoveAttackProfile(profile.id)} /></div> : null
                            }
                            <DropDown
                                color="secondary"
                                title="Attack Stats"
                                isOpen={isDropdownOpen}
                                onToggle={() => handleDropdownToggle(profile.id)}
                            >
                                <div className={style.form} onClick={(e) => e.stopPropagation()}>
                                    <AttackInputs profileId={profile.id} attackStats={profile.attackStats} handleAttackChange={handleAttackChange} />
                                    <AttackModifiers profileId={profile.id} modifiers={profile.modifiers} handleModifiersChange={handleModifiersChange} />
                                </div>

                            </DropDown>
                        </div>

                    )
                })}
                <AddCircleOutlineIcon
                    onClick={() => {
                        handleAddAttackProfile()
                    }}
                    className={style.addFormIcon}
                />
            </div>
            <button className={style.submitButton}
                onClick={() => {
                    handleFormSubmit()
                }}
            >
                Submit
            </button >
        </div >
    )
}
