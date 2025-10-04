import styles from "./resultsBarChart.module.css"
import { orangePalette } from "@mui/x-charts/colorPalettes"
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';

type WoundTallies = Record<number, number>;


interface BarChartProps {
    results: WoundTallies
    setOpenModal: (value: boolean) => void
}

function findMean(table: WoundTallies, precision = 2): number {
    let weightedSum = 0;      // Σ (wounds × occurrences)
    let totalOccurrences = 0; // Σ occurrences

    for (const [woundsStr, occurrences] of Object.entries(table)) {
        const wounds = Number(woundsStr);   // keys come out as strings
        weightedSum += wounds * occurrences;
        totalOccurrences += occurrences;
    }

    const mean = weightedSum / totalOccurrences;
    return Number(mean.toFixed(precision));   // e.g. 2 decimal places
}

function findCentralBand(table: WoundTallies, mass = 0.8) {
    // 1. Canonicalise to an array once, then re-use it
    const sorted = Object.entries(table)
        .map(([wounds, pct]) => ({ wounds: Number(wounds), pct }))
        .sort((a, b) => a.wounds - b.wounds);

    const tail = (1 - mass) / 2;            // fractional mass in each tail
    let acc = 0;
    let lower = sorted[0].wounds;

    // 2. Walk up from the low end
    for (const r of sorted) {
        acc += r.pct / 100;
        if (acc >= tail) {
            lower = r.wounds;
            break;
        }
    }

    // 3. Walk down from the high end
    acc = 0;
    let upper = sorted[sorted.length - 1].wounds;
    for (let i = sorted.length - 1; i >= 0; i--) {
        acc += sorted[i].pct / 100;
        if (acc >= tail) {
            upper = sorted[i].wounds;
            break;
        }
    }

    return { lower, upper };
}

export default function ResultsBarChart({ results, setOpenModal }: BarChartProps) {

    const resultsTitles: string[] = Object.keys(results)
    const resultsValue: number[] = Object.values(results)

    const mean = findMean(results)
    const band = findCentralBand(results)


    return (
        <div className={styles.resultsModal}>
            <span className={styles.results__span}>
                <div>
                    Mean:<span>{mean}</span>
                </div>
                <div>
                    80% Band: <span>{band.lower} - {band.upper}</span>
                </div>
            </span>
            <BarChart
                xAxis={[{
                    label: "Wounds",
                    data: resultsTitles
                }]}
                yAxis={[{
                    label: "Percent",
                    colorMap: {
                        type: 'piecewise',
                        thresholds: [5, 10, 20],     // split the scale at these Y values
                        colors: ['#ef5350',
                            '#ffca28',
                            '#66bb6a']
                    }
                }]}
                series={[{ data: resultsValue }]}
                height={500}
                colors={orangePalette}
                sx={() => ({

                    [`.${axisClasses.root}`]: {
                        [`.${axisClasses.tick}, .${axisClasses.line}`]: {
                            stroke: '#ffffff',
                            strokeWidth: 1,
                        },
                        [`.${axisClasses.tickLabel}`]: {
                            fill: '#ffffff',
                        },
                        [`.${axisClasses.label}`]: {
                            stroke: "#ffffff"
                        },

                    },

                })}
            />
            <button onClick={() => setOpenModal(false)}>
                Close
            </button>
        </div>
    )
}