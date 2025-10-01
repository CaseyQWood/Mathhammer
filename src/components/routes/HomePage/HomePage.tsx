import { motion, } from "motion/react"
import { useEffect, useState, useRef } from "react"
import styles from './homePage.module.css'
import UnitForm from "../../unitForm"
import ResultsBarChart from "../../resultsBarChart"

type WoundTallies = Record<number, number>;


const sidebarVariants = {
    open: {
        clipPath: `circle(100vh at 40px 40px)`,
        // ... transition
    },
    closed: {
        clipPath: "circle(4rem at 40px 40px)",
        // ... transition
    },
    hidden: { clipPath: "circle(0 at 40px 40px)" }
}

const listItem: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 0,
    margin: 0,
    listStyle: "none",
    marginBottom: 20,
    cursor: "pointer",
}

const itemVariants = {
    open: {
        y: 0,
        opacity: 1,
        transition: { y: { stiffness: 1000, velocity: -100 } },
    },
    closed: {
        y: 50,
        opacity: 0,
        transition: { y: { stiffness: 1000 } },
    },
}

const AsideItem = ({ i }) => {
    // ...
    return (
        <motion.li
            key={`li-${i}`}
            style={listItem}
            variants={itemVariants}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
        >
            TEST
        </motion.li>
    )
}


export default function HomePage() {
    const [simData, setSimData] = useState<WoundTallies>()
    const [openAside, setOpenAside] = useState(false)

    const test = [0, 1, 2, 3, 4, 5]

    useEffect(() => { console.log(openAside) }, [openAside])

    return (
        <motion.div className={styles.homePageWrapper} initial={{ backgroundColor: "#001524" }} key="home">
            <motion.aside
                onClick={() => setOpenAside(!openAside)}
                variants={sidebarVariants}
                initial="hidden"
                animate={openAside ? "open" : "closed"}
                exit="hidden"
            >
                <motion.ul>
                    {test.map((index) => (
                        <AsideItem i={index} />
                    ))}
                </motion.ul>
            </motion.aside>
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