import { motion } from "motion/react"
import { useState } from "react"
import styles from './homePage.module.css'
import UnitForm from "../../unitForm"
import ResultsBarChart from "../../resultsBarChart"

type WoundTallies = Record<number, number>;


export default function HomePage() {
    const [simData, setSimData] = useState<WoundTallies>()


    return (
        <motion.div className={styles.homePageWrapper} initial={{ backgroundColor: "#001524" }} key="home">
            <aside>aside</aside>
            <motion.h2>Calculate</motion.h2>
            <UnitForm setSimData={setSimData} />
            {simData ?
                <ResultsBarChart results={simData} />
                : null
            }
            <motion.nav>Nav</motion.nav>
        </motion.div>
    )
}