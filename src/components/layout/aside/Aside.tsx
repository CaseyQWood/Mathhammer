import { motion } from "motion/react"
import style from './aside.module.css'
import { useState } from "react"

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

const AsideItem = ({ i }: { i: number }) => {
    // ...
    return (
        <motion.li
            key={`li-${i}`}
            variants={itemVariants}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
                e.stopPropagation()
            }}
        >
            TEST
        </motion.li>
    )
}

export default function Aside() {
    const test = [0, 1, 2, 3, 4, 5]

    const [openAside, setOpenAside] = useState(false)

    return (
        <motion.aside

            variants={sidebarVariants}
            initial="hidden"
            animate={openAside ? "open" : "closed"}
            exit="hidden"
        >
            <a href="#" onClick={() => setOpenAside(!openAside)} className={`${style.buttonNav} ${openAside ? style.buttonClose : null}`}>
                <div className={style.inner}></div>
            </a>
            <motion.ul>
                {test.map((index) => (
                    <AsideItem i={index} />
                ))}
            </motion.ul>
        </motion.aside>
    )
}