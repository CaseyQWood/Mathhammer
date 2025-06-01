import { orangePalette } from "@mui/x-charts/colorPalettes"
import { BarChart, barElementClasses } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';



interface BarChartProps {
    results: number[][]
}

export default function ResultsBarChart({ results }: BarChartProps) {
    const colors: string[] = ['#006BD6', '#EC407A'];

    const resultsTitles: string[] = Object.keys(results)
    const resultsValue = Object.values(results).map((x) => {
        return { data: [x] }
    })
    console.log(resultsValue)

    return (
        <BarChart
            xAxis={[{
                data: resultsTitles, colorMap: {
                    type: 'piecewise',
                    thresholds: [100, 300, 400],
                    colors: ['blue', 'red', 'blue'],
                }
            }]}
            yAxis={[{
                colorMap: {
                    type: 'piecewise',            // or 'continuous' / 'ordinal'
                    thresholds: [10, 50, 100],     // split the scale at these Y values
                    colors: ['#ef5350',           // < 0   → red
                        '#ffca28',           // 0–50 → amber
                        '#66bb6a']           // >50  → green
                }
            }]}
            series={[{ data: Object.values(results) }]}
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
                },

            })}
        />
    )
}