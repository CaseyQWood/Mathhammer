import type { DefenseStats } from "../../types/unitStats";
import InputField from "../inputField";
import style from './unitForm.module.css'

interface DefenseStatsProps {
  defenseStats: DefenseStats
  handleDefenseChange: (key: string, value: number) => void
}

export default function DefenseInputs({ defenseStats, handleDefenseChange }: DefenseStatsProps) {
  return (
    <div onClick={(e) => e.stopPropagation()} className={style.defensiveStats__wrapper}>
      <InputField
        title="Toughness"
        value={defenseStats.toughness}
        setValue={(value) => handleDefenseChange("toughness", value)}
        min={1}
        max={20}
      />
      <InputField
        title="Save"
        value={defenseStats.save}
        setValue={(value) => handleDefenseChange("save", value)}
        min={0}
        max={6}
      />
      <InputField
        title="Invuln"
        value={defenseStats.invulnerable}
        setValue={(value) => handleDefenseChange("invulnerable", value)}
        min={0}
        max={6}
      />
      <InputField
        title="Fnp"
        value={defenseStats.feelNoPain}
        setValue={(value) => handleDefenseChange("feelNoPain", value)}
        min={0}
        max={6}
      />
    </div>
  );
}
