import { motion } from "motion/react"
import { useState, useCallback } from "react"
import styles from './homePage.module.css'
import UnitForm from "@/features/calculator/components/UnitForm"
// import Aside from "@/components/layout/aside/Aside"
import ResultsBarChart from "@/features/calculator/components/ResultsBarChart"
import { runSimulation } from "@/lib/runSimulation";
import type { DefenseStats, AttackProfile } from "@/types/unitStats"


type WoundTallies = Record<number, number>;


const defaultDefenceStats = {
    toughness: 4,
    save: 3,
    invulnerable: 0,
    feelNoPain: 0,
}
const defaultAttackProfile: AttackProfile = {
    attackStats: {
        models: 1,
        attacks: {
            variable: "0",
            value: 1
        },
        weaponSkill: 3,
        strength: 4,
        armourPiercing: 1,
        damage: {
            variable: "0",
            value: 1
        }
    },
    modifiers: {
        lethalHits: false,
        sustainedHits: { value: false, variable: "1" },
        devastatingWounds: false,
        torrent: false,
        reRollHit: false,
        reRollOneToHit: false,
        reRollWound: false,
        reRollOneToWound: false
    }
}


export default function HomePage() {
    const simCount = 10000
    const [openModal, setOpenModal] = useState(false)
    const [simData, setSimData] = useState<WoundTallies>()
    const [defenseStats, setdefenseStats] = useState<DefenseStats>(defaultDefenceStats)
    const [attackProfiles, setAttackProfiles] = useState<AttackProfile[]>([defaultAttackProfile])


    const handleDefenseChange = (key: string, value: number) => {
        setdefenseStats(prevStats => ({
            ...prevStats,
            [key]: value
        }));
    };

    const handleAddAttackProfile = useCallback(() => {
        setAttackProfiles(prevProfiles => [
            ...prevProfiles,
            defaultAttackProfile
        ])
    }, []);


    const handleAttackChange = useCallback((profileIndex: number, key: string, value: boolean | number | null | { variable: string; value: boolean | number; }) => {
        setAttackProfiles(prevProfiles => {
            const newProfiles = [...prevProfiles];
            newProfiles[profileIndex] = {
                ...newProfiles[profileIndex],
                attackStats: {
                    ...newProfiles[profileIndex].attackStats,
                    [key]: value
                }
            };
            return newProfiles;
        });
    }, []);

    const handleModifiersChange = useCallback((profileIndex: number, key: string, value: boolean | number | null | { variable: string | null; value: boolean | number; }) => {
        setAttackProfiles(prevProfiles => {
            const newProfiles = [...prevProfiles];
            newProfiles[profileIndex] = {
                ...newProfiles[profileIndex],
                modifiers: {
                    ...newProfiles[profileIndex].modifiers,
                    [key]: value
                }
            };
            return newProfiles;
        });
    }, [])



    const handleFormSubmit = useCallback(() => {
        runSimulation(simCount, attackProfiles, defenseStats).then((results) => {
            setSimData(results)
            setOpenModal(true)
        })
    }, [attackProfiles, defenseStats])



    return (
        <motion.div className={styles.homePageWrapper} initial={{ backgroundColor: "#001524" }} key="home">
            {/* <Aside /> */}
            <motion.h2>Calculate</motion.h2>
            <div className={styles.workspace}>
                <UnitForm defenseStats={defenseStats} attackProfiles={attackProfiles} handleAddAttackProfile={handleAddAttackProfile} handleDefenseChange={handleDefenseChange} handleAttackChange={handleAttackChange} handleModifiersChange={handleModifiersChange} handleFormSubmit={() => { handleFormSubmit() }} />
                {openModal && simData ?
                    <ResultsBarChart results={simData} setOpenModal={setOpenModal} />
                    : null
                }
            </div>
            {/* <motion.nav>Nav</motion.nav> */}
        </motion.div >
    )
}
