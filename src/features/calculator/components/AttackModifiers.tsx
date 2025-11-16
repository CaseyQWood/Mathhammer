import style from "./unitForm.module.css"
import { useEffect, useState, useMemo } from "react";
import type { Modifiers } from "@/types/unitStats";
import CheckIcon from '@mui/icons-material/Check';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';

interface AttackModifierProps {
    profileId: string
    modifiers: Modifiers
    handleModifiersChange: (profileId: string, key: string, value: boolean | number | null | { variable: string | null; value: boolean | number; }) => void
}

// pull down modifiers to manage toggle 

export default function AttackModifiers({ profileId, modifiers, handleModifiersChange }: AttackModifierProps) {
    const [selected, setSelected] = useState<string[]>([]);

    const options = [
        { key: crypto.randomUUID(), value: "1" },
        { key: crypto.randomUUID(), value: "3" },
        { key: crypto.randomUUID(), value: "D3" },
        { key: crypto.randomUUID(), value: "2D3" },
        { key: crypto.randomUUID(), value: "3D3" },
        { key: crypto.randomUUID(), value: "D6" },
        { key: crypto.randomUUID(), value: "2D6" },
        { key: crypto.randomUUID(), value: "3D6" },

    ]
    const [sustainedHits, setSustainedHits] = useState<string | null>("1")


    const handleVariableChange = (
        _event: unknown,
        newVal: string | null,
    ) => {

        setSustainedHits(newVal);
    };

    const modifiersData = useMemo(() => ({
        lethalHits: 'Lethal Hits',
        sustainedHits: 'Sustained Hits',
        devastatingWounds: 'devastating Wounds',
        torrent: 'Torrent',
        reRollHit: 'Re-roll to Hit',
        reRollOneToHit: "Re-roll 1 to Hit",
        reRollWound: 'Re-roll to Wound',
        reRollOneToWound: "Re-roll 1 to Wound"
    }), [])

    useEffect(() => {
        for (let i = 0; i < Object.keys(modifiersData).length; i++) {
            const key = Object.values(modifiersData)[i]
            if (selected.includes(key)) {
                if (Object.keys(modifiers)[i] === "sustainedHits") {
                    handleModifiersChange(profileId, Object.keys(modifiers)[i], { value: true, variable: sustainedHits })
                    continue
                }

                handleModifiersChange(profileId, Object.keys(modifiers)[i], true)
                continue
            }

            if (!selected.includes(key)) {
                if (Object.keys(modifiers)[i] === "sustainedHits") {
                    handleModifiersChange(profileId, Object.keys(modifiers)[i], { value: false, variable: sustainedHits })
                    continue
                }

                handleModifiersChange(profileId, Object.keys(modifiers)[i], false)
                continue


            }
        }
    }, [selected, handleModifiersChange, sustainedHits, profileId, modifiers, modifiersData])

    return (
        <ul className={style.list__wrapper}>
            {Object.values(modifiersData).map((name, index) => {
                const checked = selected.includes(name);
                return (
                    <li key={`${name}--${index}`} onClick={() => {
                        setSelected((names) => {
                            return checked
                                ? names.filter((n) => n !== name)
                                : [...names, name];
                        });
                    }}>
                        <label>{name}</label>
                        <div onClick={(e) => e.stopPropagation()} className={checked && name === "Sustained Hits" ? style.sustainedHits : ""}>
                            {checked && name === "Sustained Hits" ? (
                                <>
                                    <select
                                        className={`${style.selectNative} ${style.jsSelectNative}`}
                                        aria-labelledby="jobLabel"
                                        name="pets"
                                        id="pet-select"
                                    >
                                        {options.map((e) => {
                                            return <option onClick={() => {
                                                handleVariableChange(e, e.value)
                                            }} value={e.value}>{e.value}</option>
                                        })}
                                    </select>
                                    <div className={style.selectCustom} aria-hidden="true"></div></>
                            ) : null}
                            <CheckBoxOutlineBlankIcon />
                            {checked ? <CheckIcon fontSize="large" style={{ position: "absolute", width: "1.25em", right: "0%" }} /> : null}
                        </div>
                    </li>
                );
            })}
        </ul >
    )
}
