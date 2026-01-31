import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ChartOptions
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

interface TrendChartProps {
    dates: string[];
    scores: number[];
    label: string;
    color?: string;
}

const TrendChart: React.FC<TrendChartProps> = ({
    dates,
    scores,
    label = 'Overall Score',
    color = '#2563eb'
}) => {
    const data = {
        labels: dates,
        datasets: [
            {
                label: label,
                data: scores,
                borderColor: color,
                backgroundColor: color,
                tension: 0.3, // Curve the line slightly
                pointRadius: 4,
                pointHoverRadius: 6,
            },
        ],
    };

    const options: ChartOptions<'line'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
                align: 'end' as const,
                labels: {
                    usePointStyle: true,
                    boxWidth: 8,
                }
            },
            title: {
                display: false,
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: '#1f2937',
                padding: 10,
                cornerRadius: 8,
            }
        },
        scales: {
            y: {
                min: 0,
                max: 100,
                grid: {
                    color: '#f3f4f6',
                },
                ticks: {
                    stepSize: 20
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        },
        interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false
        }
    };

    return (
        <div style={{ width: '100%', height: '100%', minHeight: '300px' }}>
            <Line options={options} data={data} />
        </div>
    );
};

export default TrendChart;
