import { useCallback, useState } from "react";
import type { DefenseStats, AttackStats, WoundTallies, Modifiers } from "../../types/unitStats";
import style from './unitForm.module.css'
import { Button, Accordion, AccordionGroup, AccordionSummary, AccordionDetails, Divider, IconButton } from "@mui/joy";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DefenseInputs from './DefenseInputs'
import AttackInputs from "./AttackInputs";
import AttackModifiers from "./AttackModifiers";
import { runSimulation } from "../../utils/runSimulation";

interface UnitFormProps {
    setSimData: (result: WoundTallies) => void
}

const accordionStyles = {
    borderRadius: "1rem"
}

export default function UnitForm({ setSimData }: UnitFormProps) {
    const defaultAttackStats = {
        models: 1,
        attacks: {
            variable: "0",
            value: 4
        },
        weaponSkill: 3,
        strength: 4,
        armourPiercing: 1,
        damage: {
            variable: "0",
            value: 1
        }
    }
    const defaultModifiers = {
        lethalHits: false,
        sustainedHits: { value: false, variable: "1" },
        devistatingWounds: false,
        torrent: false,
        reRollHit: false,
        reRollOneToHit: false,
        reRollWound: false,
        reRollOneToWound: false
    }
    const [defenseStats, setdefenseStats] = useState<DefenseStats>({
        toughness: 4,
        save: 3,
        invulnerable: 0,
        feelNoPain: 0,
    })
    const handleDefenseChange = (key: string, value: number) => {
        setdefenseStats(prevStats => ({
            ...prevStats,
            [key]: value
        }));
    };
    const [attackStats, setAttackStats] = useState<AttackStats[]>([{
        models: 1,
        attacks: {
            variable: "0",
            value: 4
        },
        weaponSkill: 3,
        strength: 4,
        armourPiercing: 1,
        damage: {
            variable: "0",
            value: 1
        }
    }])
    console.log("attack stats: ", attackStats)

    const handleAttackChange = useCallback((profileIndex: number, key: string, value: boolean | number | null | { variable: string; value: boolean | number; }) => {
        setAttackStats(prevStats => {
            const newStats = [...prevStats];
            newStats[profileIndex] = {
                ...newStats[profileIndex],
                [key]: value
            };
            return newStats;
        });
    }, []);

    const [modifiers, setModifiers] = useState<Modifiers[]>([{
        lethalHits: false,
        sustainedHits: { value: false, variable: "1" },
        devistatingWounds: false,
        torrent: false,
        reRollHit: false,
        reRollOneToHit: false,
        reRollWound: false,
        reRollOneToWound: false
    }])

    const handleModifiersChange = useCallback((profileIndex: number, key: string, value: boolean | number | null | { variable: string | null; value: boolean | number; }) => {
        // setModifiers(prevStats => ({
        //     ...prevStats,
        //     [key]: value
        // }));

        setAttackStats(prevStats => {
            const newStats = [...prevStats];
            newStats[profileIndex] = {
                ...newStats[profileIndex],
                [key]: value
            };
            return newStats;
        });
    }, [])

    return (
        <div className={style.unitForm__wrapper} >
            <AccordionGroup
                color="neutral"
                size="lg"
                variant="plain"
                sx={{ gap: "1rem" }}
            >
                <Accordion variant="soft" sx={accordionStyles}>
                    <AccordionSummary>Defence Stats</AccordionSummary>
                    <AccordionDetails>
                        <DefenseInputs defenseStats={defenseStats} handleDefenseChange={handleDefenseChange} />
                    </AccordionDetails>
                </Accordion>
                <Divider />

                {attackStats.map((ele, index) => {
                    return (
                        <Accordion key={index} variant="soft" sx={accordionStyles}>
                            <AccordionSummary>Attack Stats</AccordionSummary>
                            <AccordionDetails>
                                <AttackInputs index={Number(index)} attackStats={ele} handleAttackChange={handleAttackChange} />
                                <AttackModifiers index={Number(index)} modifiers={modifiers[index]} handleModifiersChange={handleModifiersChange} />
                            </AccordionDetails>
                        </Accordion>
                    )
                })}
                <IconButton
                    size="lg"
                    onClick={() => {
                        setAttackStats([...attackStats, defaultAttackStats])
                        setModifiers([...modifiers, defaultModifiers])
                    }}
                    sx={{
                        width: "25%",
                        margin: "0 auto",
                    }}
                >
                    <AddCircleOutlineIcon color="primary" />

                </IconButton>
                <Divider />
                <Button
                    fullWidth={false}
                    variant="soft"
                    color="warning"
                    onClick={() => {
                        runSimulation(5000, attackStats, defenseStats, modifiers).then((results) => {
                            setSimData(results)
                        })
                    }}

                >
                    Submit
                </Button >
            </AccordionGroup>
        </div >
    )
}