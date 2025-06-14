import { useCallback, useEffect, useState } from "react";
import type { DefenseStats, AttackStats, WoundTallies, Modifiers } from "../../types/unitStats";
import { Button, Accordion, AccordionGroup, AccordionSummary, AccordionDetails } from "@mui/joy";
import DefenseInputs from './DefenseInputs'
import AttackInputs from "./AttackInputs";
import AttackModifiers from "./AttackModifiers";
import { runSimulation } from "../../utils/runSimulation";

interface UnitFormProps {
    setSimData: (result: WoundTallies) => void
}

export default function UnitForm({ setSimData }: UnitFormProps) {
    const [defenseStats, setdefenseStats] = useState<DefenseStats>({
        toughness: 4,
        save: 3,
        invulnerable: 0,
        feelNoPain: 0,
    })
    const handleDefenseChange = (stat: string, value: number) => {
        setdefenseStats(prevStats => ({
            ...prevStats,
            [stat]: value
        }));
    };
    const [attackStats, setAttackStats] = useState<AttackStats>({
        models: 10,
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
    })

    const handleAttackChange = useCallback((stat: string, value: number | { variable: string; value: number } | null) => {
        setAttackStats(prevStats => ({
            ...prevStats,
            [stat]: value
        }));
    }, [setAttackStats]);

    const [modifiers, setModifiers] = useState<Modifiers>({
        lethalHits: false,
        sustainedHits: { value: false, variable: "1" },
        devistatingWounds: false,
        torrent: false,
        reRollHit: false,
        reRollWound: false,
    })

    const handleModifiersChange = useCallback((stat: string, value: boolean | { value: boolean; variable: string }) => {
        setModifiers(prevStats => ({
            ...prevStats,
            [stat]: value
        }));
    }, [])

    useEffect(() => {
        console.log("attack stats: ", attackStats)
    }, [attackStats])

    return (
        <>
            <AccordionGroup
                color="neutral"
                size="lg"
                variant="plain"
            >
                <Accordion>
                    <AccordionSummary>Defence Stats</AccordionSummary>
                    <AccordionDetails>
                        <DefenseInputs defenseStats={defenseStats} handleDefenseChange={handleDefenseChange} />
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary>Attack Stats</AccordionSummary>
                    <AccordionDetails>
                        <AttackInputs attackStats={attackStats} handleAttackChange={handleAttackChange} />
                        <AttackModifiers attackStats={attackStats} handleModifiersChange={handleModifiersChange} />
                    </AccordionDetails>
                </Accordion>
                <Button
                    fullWidth={false}
                    onClick={() => {
                        runSimulation(5000, attackStats, defenseStats, modifiers).then((results) => {
                            setSimData(results)
                        })
                    }}
                >
                    Submit
                </Button>
            </AccordionGroup>


        </>
    )
}