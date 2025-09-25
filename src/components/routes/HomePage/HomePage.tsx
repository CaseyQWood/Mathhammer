import { motion } from "motion/react"
import { useState } from "react"
import UnitForm from "../../unitForm"
import ResultsBarChart from "../../resultsBarChart"

type WoundTallies = Record<number, number>;


export default function HomePage() {
    const [simData, setSimData] = useState<WoundTallies>()


    return (
        <motion.article initial={{ backgroundColor: "#001524" }} key="home">
            <UnitForm setSimData={setSimData} />
            {simData ?
                <ResultsBarChart results={simData} />
                : null
            }
        </motion.article>
    )
}