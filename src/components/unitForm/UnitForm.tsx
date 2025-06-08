import { useState } from "react";
import type { DefenseStats, AttackStats, WoundTallies } from "../../types/unitStats";
import { Button } from "@mui/joy";
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
    const handleDefenseChange = (stat: keyof DefenseStats, value: number) => {
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

    const handleAttackChange = (stat: keyof AttackStats, value: number) => {
        setAttackStats(prevStats => ({
            ...prevStats,
            [stat]: value
        }));
    };


    return (
        <>
            <DefenseInputs defenseStats={defenseStats} handleDefenseChange={handleDefenseChange} />
            <AttackInputs attackStats={attackStats} handleAttackChange={handleAttackChange} />
            <Button
                fullWidth={false}
                onClick={() => {
                    runSimulation(25000, attackStats, defenseStats).then((results) => {
                        // console.log("simulation state: ", results)
                        setSimData(results)
                    })
                }}
            >
                Submit
            </Button>
        </>
    )
}