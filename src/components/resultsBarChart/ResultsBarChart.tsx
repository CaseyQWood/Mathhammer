import { orangePalette } from "@mui/x-charts/colorPalettes"
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';



interface BarChartProps {
    results: number[][]
}

export default function ResultsBarChart({ results }: BarChartProps) {

    const resultsTitles: string[] = Object.keys(results)
    const resultsValue: (number | null)[] = Object.values(results).map((x) => {
        return (Number(x) / 50000) * 100
    })
    console.log("result values", resultsValue)

    return (
        <BarChart
            xAxis={[{
                label: "Wounds",
                data: resultsTitles
            }]}
            yAxis={[{
                label: "Percent",
                colorMap: {
                    type: 'piecewise',            // or 'continuous' / 'ordinal'
                    thresholds: [10, 30, 50],     // split the scale at these Y values
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
                    }
                },

            })}
        />
    )
}