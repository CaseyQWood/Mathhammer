import style from "./unitForm.module.css"
import { useEffect, useState } from "react";
import { Chip, Checkbox } from "@mui/joy";
import type { Modifiers } from "../../types/unitStats";

interface AttackModifierProps {
    modifiers: Modifiers
    handleModifiersChange: (stat: string, value: boolean | { value: boolean; variable: string }) => void
}

// pull down modifiers to manage toggle 

export default function AttackModifiers({ modifiers, handleModifiersChange }: AttackModifierProps) {
    const [selected, setSelected] = useState<string[]>([]);

    const modifiersData = {
        lethalHits: 'Lethal Hits',
        sustainedHits: 'Sustained Hits',
        devistatingWounds: 'Devistating Wounds',
        torrent: 'Torrent',
        reRollHit: 'Re-roll to Hit',
        reRollOneToHit: "Re-roll 1 to Hit",
        reRollWound: 'Re-roll to Wound',
        reRollOneToWound: "Re-roll 1 to Wound"
    }

    useEffect(() => {
        for (let i = 0; i < Object.keys(modifiersData).length; i++) {
            const key = Object.values(modifiersData)[i]
            if (selected.includes(key)) {
                if (Object.keys(modifiers)[i] === "sustainedHits") {
                    handleModifiersChange(Object.keys(modifiers)[i], { value: true, variable: "1" })
                    continue
                }

                handleModifiersChange(Object.keys(modifiers)[i], true)
                continue
            }

            if (!selected.includes(key)) {
                if (Object.keys(modifiers)[i] === "sustainedHits") {
                    handleModifiersChange(Object.keys(modifiers)[i], { value: false, variable: "1" })
                    continue
                }

                handleModifiersChange(Object.keys(modifiers)[i], false)
                continue


            }
        }
    }, [selected, handleModifiersChange])

    return (
        <div className={style.chip__wrapper}>
            {Object.values(modifiersData).map((name) => {
                const checked = selected.includes(name);
                return (
                    <Chip
                        key={name}
                        variant="plain"
                        color={checked ? 'primary' : 'neutral'}

                    >
                        <Checkbox
                            variant="outlined"
                            color={checked ? 'primary' : 'neutral'}
                            disableIcon
                            overlay
                            label={name}
                            checked={checked}
                            onChange={(event) => {
                                setSelected((names) =>
                                    !event.target.checked
                                        ? names.filter((n) => n !== name)
                                        : [...names, name],
                                );
                            }}
                        />
                    </Chip>
                );
            })}
        </div>
    )
}