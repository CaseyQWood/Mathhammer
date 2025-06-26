import style from "./unitForm.module.css"
import { useEffect, useState } from "react";
import { Chip, Checkbox, Select, Option } from "@mui/joy";
import type { Modifiers } from "../../types/unitStats";

interface AttackModifierProps {
    index: number
    modifiers: Modifiers
    handleModifiersChange: (index: number, key: string, value: boolean | number | null | { variable: string | null; value: boolean | number; }) => void
}

// pull down modifiers to manage toggle 

export default function AttackModifiers({ index, modifiers, handleModifiersChange }: AttackModifierProps) {
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
        console.log(newVal)
        setSustainedHits(newVal);
    };

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
                    handleModifiersChange(index, Object.keys(modifiers)[i], { value: true, variable: sustainedHits })
                    continue
                }

                handleModifiersChange(index, Object.keys(modifiers)[i], true)
                continue
            }

            if (!selected.includes(key)) {
                if (Object.keys(modifiers)[i] === "sustainedHits") {
                    handleModifiersChange(index, Object.keys(modifiers)[i], { value: false, variable: sustainedHits })
                    continue
                }

                handleModifiersChange(index, Object.keys(modifiers)[i], false)
                continue


            }
        }
    }, [selected, handleModifiersChange, sustainedHits, index])

    return (
        <div className={style.chip__wrapper}>
            {Object.values(modifiersData).map((name, index) => {
                const checked = selected.includes(name);
                return (
                    <div key={index} className={name === "Sustained Hits" ? style.sustainedHits : ""}>
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
                        {name === "Sustained Hits" ? <Select
                            value={sustainedHits}
                            onChange={handleVariableChange}
                            size="md"
                            variant="outlined"
                            sx={{
                                width: '25%',
                                alignContent: 'center',
                                padding: '0.5rem'
                            }}
                        >
                            {options.map((ele) => {
                                return <Option key={ele.key} value={ele.value} >{ele.value}</Option>
                            })}
                        </Select> : null}
                    </div>
                );
            })}
        </div>
    )
}