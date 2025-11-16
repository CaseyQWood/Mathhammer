import style from "./unitForm.module.css";
import { useMemo, useState } from "react";
import type { Modifiers } from "@/types/unitStats";
import CheckIcon from "@mui/icons-material/Check";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";

interface AttackModifierProps {
    profileId: string;
    modifiers: Modifiers;
    handleModifiersChange: (
        profileId: string,
        key: string,
        value:
            | boolean
            | number
            | null
            | { variable: string | null; value: boolean | number }
    ) => void;
}

export default function AttackModifiers({
    profileId,
    modifiers,
    handleModifiersChange,
}: AttackModifierProps) {
    const [sustainedHits, setSustainedHits] = useState<string | null>(
        typeof modifiers.sustainedHits === "object"
            ? modifiers.sustainedHits.variable
            : "1"
    );

    const options = [
        "1",
        "3",
        "D3",
        "2D3",
        "3D3",
        "D6",
        "2D6",
        "3D6",
    ];

    const modifiersData = useMemo(
        () => ({
            lethalHits: "Lethal Hits",
            sustainedHits: "Sustained Hits",
            devastatingWounds: "Devastating Wounds",
            torrent: "Torrent",
            reRollHit: "Re-roll to Hit",
            reRollOneToHit: "Re-roll 1 to Hit",
            reRollWound: "Re-roll to Wound",
            reRollOneToWound: "Re-roll 1 to Wound",
        }),
        []
    );

    const toggleModifier = (key: string) => {
        const current = modifiers[key];
        const isChecked = typeof current === "object" ? current.value : current;

        if (key === "sustainedHits") {
            handleModifiersChange(profileId, key, {
                value: !isChecked,
                variable: sustainedHits,
            });
        } else {
            handleModifiersChange(profileId, key, !isChecked);
        }
    };

    const handleVariableChange = (newVal: string) => {
        setSustainedHits(newVal);
        handleModifiersChange(profileId, "sustainedHits", {
            value:
                typeof modifiers.sustainedHits === "object"
                    ? modifiers.sustainedHits.value
                    : false,
            variable: newVal,
        });
    };

    return (
        <ul className={style.list__wrapper}>
            {Object.entries(modifiersData).map(([key, name], index) => {
                const modifier = modifiers[key];
                const checked =
                    typeof modifier === "object" ? modifier.value : modifier;

                return (
                    <li
                        key={`${name}--${index}`}
                        onClick={() => toggleModifier(key)}
                        className={style.listItem}
                    >
                        <label>{name}</label>
                        <div
                            onClick={(e) => e.stopPropagation()}
                            className={
                                checked && key === "sustainedHits"
                                    ? style.sustainedHits
                                    : undefined
                            }
                        >
                            {checked && key === "sustainedHits" ? (
                                <select
                                    className={`${style.selectNative} ${style.jsSelectNative}`}
                                    aria-labelledby="jobLabel"
                                    value={sustainedHits ?? ""}
                                    onChange={(e) => handleVariableChange(e.target.value)}
                                >
                                    {options.map((val) => (
                                        <option key={val} value={val}>
                                            {val}
                                        </option>
                                    ))}
                                </select>
                            ) : null}

                            <CheckBoxOutlineBlankIcon />
                            {checked ? (
                                <CheckIcon
                                    fontSize="large"
                                    style={{
                                        position: "absolute",
                                        width: "1.25em",
                                        right: "0%",
                                    }}
                                />
                            ) : null}
                        </div>
                    </li>
                );
            })}
        </ul>
    );
}
