import { useState, type ReactNode, type CSSProperties } from "react"
import style from "./dropDown.module.css"

type Color = "primary" | "secondary"

const colorsTable: {
    primary: CSSProperties;
    secondary: CSSProperties;
} = {
    primary: { backgroundColor: "#15616d", color: "#ffecd1" },
    secondary: { backgroundColor: "#ff7d00", color: "#001524" },
};

interface DropDownProps {
    title: string
    color: Color
    children: ReactNode
    isOpen?: boolean
    onToggle?: () => void
}

export default function DropDown({ title, color = "primary", children, isOpen: controlledIsOpen, onToggle }: DropDownProps) {
    const [internalOpen, setInternalOpen] = useState(false)
    
    // Use controlled state if provided, otherwise use internal state
    const open = controlledIsOpen !== undefined ? controlledIsOpen : internalOpen
    
    const handleToggle = () => {
        if (onToggle) {
            onToggle()
        } else {
            setInternalOpen(!internalOpen)
        }
    }

    return (
        <div className={style.dropDown__wrapper} style={colorsTable[color]} onClick={handleToggle}>
            <div className={style.preview}>
                <h3>{title}</h3>
                <svg fill={color === 'primary' ? "#ffecd1" : "#001524"} transform={`rotate(${open ? "180" : "0"})`} width="10%" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M297.4 470.6C309.9 483.1 330.2 483.1 342.7 470.6L534.7 278.6C547.2 266.1 547.2 245.8 534.7 233.3C522.2 220.8 501.9 220.8 489.4 233.3L320 402.7L150.6 233.4C138.1 220.9 117.8 220.9 105.3 233.4C92.8 245.9 92.8 266.2 105.3 278.7L297.3 470.7z" /></svg>
            </div>

            {open ?
                <div className={style.children__wrapper}>
                    {children}
                </div>
                : null}


        </div>
    )
}