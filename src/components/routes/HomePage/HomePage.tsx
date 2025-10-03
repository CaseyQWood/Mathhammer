import { motion } from "motion/react"
import { useState, useCallback } from "react"
import styles from './homePage.module.css'
import UnitForm from "../../unitForm"
import Aside from "../../aside"
import ResultsBarChart from "../../resultsBarChart"
import { runSimulation } from "../../../utils/runSimulation";
import type { DefenseStats, AttackStats, Modifiers } from "../../../types/unitStats"


type WoundTallies = Record<number, number>;


const defaultDefenceStats = {
    toughness: 4,
    save: 3,
    invulnerable: 0,
    feelNoPain: 0,
}
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
    devastatingWounds: false,
    torrent: false,
    reRollHit: false,
    reRollOneToHit: false,
    reRollWound: false,
    reRollOneToWound: false
}


export default function HomePage() {
    const simCount = 250000
    const [simData, setSimData] = useState<WoundTallies>()
    const [defenseStats, setdefenseStats] = useState<DefenseStats>(defaultDefenceStats)
    const [attackStats, setAttackStats] = useState<AttackStats[]>([defaultAttackStats])
    const [modifiers, setModifiers] = useState<Modifiers[]>([defaultModifiers])


    const handleDefenseChange = (key: string, value: number) => {
        setdefenseStats(prevStats => ({
            ...prevStats,
            [key]: value
        }));
    };

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

    const handleModifiersChange = useCallback((profileIndex: number, key: string, value: boolean | number | null | { variable: string | null; value: boolean | number; }) => {
        setModifiers(prevStats => {
            const newStats = [...prevStats];
            newStats[profileIndex] = {
                ...newStats[profileIndex],
                [key]: value
            };
            return newStats;
        });
    }, [])


    return (
        <motion.div className={styles.homePageWrapper} initial={{ backgroundColor: "#001524" }} key="home">
            <Aside />
            <motion.h2>Calculate</motion.h2>
            <UnitForm defenseStats={defenseStats} attackStats={attackStats} modifiers={modifiers} handleDefenseChange={handleDefenseChange} handleAttackChange={handleAttackChange} handleModifiersChange={handleModifiersChange} />
            {simData ?
                <ResultsBarChart results={simData} />
                : null
            }
            <button
                onClick={() => {
                    runSimulation(simCount, attackStats, defenseStats, modifiers).then((results) => {
                        setSimData(results)
                    })
                }}

            >
                Submit
            </button >
            <motion.nav>Nav</motion.nav>
        </motion.div>
    )
}