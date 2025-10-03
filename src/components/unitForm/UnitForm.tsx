import style from './unitForm.module.css'
import DropDown from "../dropDown/DropDown";

import DefenseInputs from './DefenseInputs'
import AttackInputs from "./AttackInputs";
import AttackModifiers from "./AttackModifiers";



export default function UnitForm({ defenseStats, attackStats, modifiers, handleDefenseChange, handleAttackChange, handleModifiersChange }) {



    return (
        <div className={style.unitForm__wrapper} >
            <div className={style.dropDown__wrapper}>
                <DropDown color="primary" title="Defence Stats">
                    <DefenseInputs defenseStats={defenseStats} handleDefenseChange={handleDefenseChange} />
                </DropDown>

                {attackStats.map((ele, index) => {
                    return (
                        <DropDown color="secondary" title="Attack Stats">
                            <div>
                                <AttackInputs index={Number(index)} attackStats={ele} handleAttackChange={handleAttackChange} />
                                <AttackModifiers index={Number(index)} modifiers={modifiers[index]} handleModifiersChange={handleModifiersChange} />
                            </div>
                        </DropDown>
                    )
                })}
            </div>


        </div >
    )
}





/*

<AccordionGroup
                color="neutral"
                size="lg"
                variant="plain"
                sx={{ gap: "1rem" }}
            >
                <Accordion variant="soft" sx={{
                    backgroundColor: "#15616d", borderRadius: "1rem"
                }}>
                    <AccordionSummary>Defence Stats</AccordionSummary>
                    <AccordionDetails>
                        <DefenseInputs defenseStats={defenseStats} handleDefenseChange={handleDefenseChange} />
                    </AccordionDetails>
                </Accordion>
                <Divider />

                {attackStats.map((ele, index) => {
                    return (
                        <Accordion key={index} variant="soft" sx={AttackAccordionStyles}>
                            <AccordionSummary sx={{ color: "#001524" }}>Attack Stats</AccordionSummary>
                            <AccordionDetails>
                                <AttackInputs index={Number(index)} attackStats={ele} handleAttackChange={handleAttackChange} />
                                <AttackModifiers index={Number(index)} modifiers={modifiers[index]} handleModifiersChange={handleModifiersChange} />
                            </AccordionDetails>
                        </Accordion>
                    )
                })}
                <IconButton
                    size="lg"
                    onClick={() => {
                        setAttackStats([...attackStats, defaultAttackStats])
                        setModifiers([...modifiers, defaultModifiers])
                    }}
                    sx={{
                        width: "25%",
                        margin: "0 auto",
                    }}
                >
                    <AddCircleOutlineIcon color="primary" />

                </IconButton>
                <Divider />
                <Button
                    fullWidth={false}
                    variant="soft"
                    color="warning"
                    onClick={() => {
                        runSimulation(simCount, attackStats, defenseStats, modifiers).then((results) => {
                            setSimData(results)
                        })
                    }}

                >
                    Submit
                </Button >
            </AccordionGroup>


*/