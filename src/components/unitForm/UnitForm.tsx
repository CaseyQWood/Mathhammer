import { useState } from "react";
import type { DefenseStats, AttackStats, WoundTallies } from "../../types/unitStats";
import { Button, Accordion, AccordionGroup, AccordionSummary, AccordionDetails } from "@mui/joy";
import DefenseInputs from './DefenseInputs'
import AttackInputs from "./AttackInputs";
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
        models: 1,
        attacks: 10,
        weaponSkill: 3,
        strength: 4,
        armourPiercing: 1,
        variableDamage: 0,
        damage: 1
    })

    const handleAttackChange = (stat: string, value: number) => {
        setAttackStats(prevStats => ({
            ...prevStats,
            [stat]: value
        }));
    };


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
                    </AccordionDetails>
                </Accordion>
                <Button
                    fullWidth={false}
                    onClick={() => {
                        runSimulation(25000, attackStats, defenseStats).then((results) => {
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