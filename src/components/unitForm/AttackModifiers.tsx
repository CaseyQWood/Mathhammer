import style from "./unitForm.module.css"
import { useEffect, useState } from "react";
import { Chip, Checkbox } from "@mui/joy";
import type { AttackStats } from "../../types/unitStats";

interface AttackModifierProps {
    attackStats: AttackStats
    handleModifiersChange: (stat: string, value: boolean | { value: boolean; variable: string }) => void
}

function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

export default function AttackModifiers({ attackStats, handleModifiersChange }: AttackModifierProps) {
    const [selected, setSelected] = useState<string[]>([]);

    const modifiers = {
        lethalHits: 'Lethal Hits',
        sustainedHits: 'Sustained Hits',
        devistatingWounds: 'Devistating Wounds',
        torrent: 'Torrent',
        reRollHit: 'Re-roll to Hit',
        reRollWound: 'Re-roll to Wound',
    }

    useEffect(() => {
        for (let i = 0; i < selected.length; i++) {
            const test = String(getKeyByValue(modifiers, selected[i]))
            if (test === "sustainedHits") {
                handleModifiersChange(test, { value: true, variable: "1" })
                console.log(test)

                continue;
            }
            console.log(test)

            handleModifiersChange(test, true)
        }

    }, [selected, attackStats])

    return (
        <div className={style.chip__wrapper}>
            {Object.values(modifiers).map((name) => {
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