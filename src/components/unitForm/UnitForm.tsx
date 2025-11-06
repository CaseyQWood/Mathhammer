import style from './unitForm.module.css'
import DropDown from "../dropDown/DropDown";
import DefenseInputs from './DefenseInputs'
import AttackInputs from "./AttackInputs";
import AttackModifiers from "./AttackModifiers";
import type { DefenseStats, AttackStats, Modifiers } from "../../types/unitStats"


interface UnitFormProps {
    defenseStats: DefenseStats
    attackStats: AttackStats[]
    modifiers: Modifiers[]
    handleDefenseChange: (key: string, value: number) => void
    handleAttackChange: (profileIndex: number, key: string, value: boolean | number | null | {
        variable: string;
        value: boolean | number;
    }) => void
    handleModifiersChange: (profileIndex: number, key: string, value: boolean | number | null | {
        variable: string | null;
        value: boolean | number;
    }) => void
    handleFormSubmit: () => void
}

export default function UnitForm({ defenseStats, attackStats, modifiers, handleDefenseChange, handleAttackChange, handleModifiersChange, handleFormSubmit }: UnitFormProps) {
    console.log("Unit Form: ", attackStats)
    return (
        <div className={style.unitForm__wrapper} >
            <div className={style.unitInputs__wrapper}>
                <DropDown color="primary" title="Defence Stats">
                    <DefenseInputs defenseStats={defenseStats} handleDefenseChange={handleDefenseChange} />
                </DropDown>

                {attackStats.map((ele, index) => {
                    return (
                        <DropDown color="secondary" title="Attack Stats">
                            <div onClick={(e) => e.stopPropagation()}>
                                <AttackInputs index={Number(index)} attackStats={ele} handleAttackChange={handleAttackChange} />
                                <AttackModifiers index={Number(index)} modifiers={modifiers[index]} handleModifiersChange={handleModifiersChange} />
                            </div>

                        </DropDown>
                    )
                })}
            </div>
            <button
                onClick={() => {
                    handleFormSubmit()
                }}
            >
                Submit
            </button >
        </div >
    )
}




/*<form onClick={(e) => e.stopPropagation()} id="unit-form" aria-describedby="form-help">
                                <p id="form-help" >Fields marked with * are required.</p>


                                <fieldset>
                                    <legend>Core profile</legend>
                                    <div >
                                        <div>
                                            <label htmlFor="models">Models *</label>
                                            <input id="models" name="models" type="number" inputMode="numeric" min="1" step="1" required aria-describedby="models-hint" />
                                            <div id="models-hint" >Number of models in the unit (min 1).</div>
                                        </div>


                                        <div>
                                            <label htmlFor="attacks">Attacks *</label>
                                            <input id="attacks" name="attacks" type="number" inputMode="numeric" min="0" step="1" required aria-describedby="attacks-hint" />
                                            <div id="attacks-hint" >Attacks per model (min 0).</div>
                                        </div>


                                        <div>
                                            <label htmlFor="ws">WS *</label>
                                            <select id="ws" name="ws" required aria-describedby="ws-hint">
                                                <option value="" disabled selected>Select</option>
                                                <option value="2+">2+</option>
                                                <option value="3+">3+</option>
                                                <option value="4+">4+</option>
                                                <option value="5+">5+</option>
                                                <option value="6+">6+</option>
                                            </select>
                                            <div id="ws-hint" >Weapon Skill (roll needed to hit).</div>
                                        </div>


                                        <div>
                                            <label htmlFor="strength">S *</label>
                                            <input id="strength" name="strength" type="number" inputMode="numeric" min="1" step="1" required aria-describedby="s-hint" />
                                            <div id="s-hint" >Strength value (min 1).</div>
                                        </div>


                                        <div>
                                            <label htmlFor="ap">AP *</label>
                                            <input id="ap" name="ap" type="number" inputMode="numeric" min="-6" max="0" step="1" required aria-describedby="ap-hint" />
                                            <div id="ap-hint" >Armor Penetration (negative numbers allowed, e.g., -1).</div>
                                        </div>


                                        <div>
                                            <label htmlFor="damage">Damage *</label>
                                            <input id="damage" name="damage" type="text" required aria-describedby="damage-hint" placeholder="1, 2, D3, D6…" pattern="^(?:[1-9]\d*|D[2-9]|D10|D12)$" />
                                            <div id="damage-hint" >Whole number or die code (D3, D6, D10, D12).</div>
                                        </div>
                                    </div>
                                </fieldset>


                                <div >
                                    <button type="reset">Reset</button>
                                    <button type="submit">Save stats</button>
                                </div>


                                <output id="form-output" htmlFor="models attacks ws strength ap damage" aria-live="polite"></output>
                            </form>

                            */