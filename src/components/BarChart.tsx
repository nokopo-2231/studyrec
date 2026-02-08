import Chart from 'react-apexcharts'
import type { ApexOptions } from 'apexcharts'
import type { StudyRecord } from '../types/study'

type Props = {
  records: StudyRecord[]
}

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const getWeekDay = (date: string) =>
  new Date(date).toLocaleDateString('en-US', { weekday: 'short' })

export const BarChart = ({ records }: Props) => {
  
  const subjects = Array.from(new Set(records.map(r => r.subject)))

  const series = subjects.map(subject => ({
    name: subject,
    data: weekDays.map(day => {
      const totalSeconds = records
        .filter(
          r => r.subject === subject && getWeekDay(r.date) === day
        )
        .reduce((sum, r) => sum + r.duration, 0);
      
      // ApexChartsには「分」換算の数値（小数点あり）で渡すと、
      // 軸の目盛りがきれいに「1.5時間」などの位置で計算されます
      return Math.round((totalSeconds / 60) * 10) / 10;
    }),
  }))

  const options: ApexOptions = {
    chart: {
      type: 'bar',
      stacked: true,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        borderRadius: 6,
        columnWidth: '65%',
      },
    },
    xaxis: {
      categories: weekDays,
      labels: { show: true }, 
    },
    yaxis: {
      labels: {
        // value は series で計算した「分」の数値
        formatter: (value: number) => {
          const h = Math.floor(value / 60);
          const m = Math.round(value % 60);
          
          if (h > 0) {
            // 1時間以上の場合は "1時間 30分" のように表示
            return `${h}時間${m > 0 ? ` ${m}分` : ''}`;
          }
          // 1時間未満は "45分" のように表示
          return `${m}分`;
        },
        style: { 
          fontSize: '12px',
          colors: '#666' // ラベルの色を少し薄くして見やすく
        },
      },
      // 目盛りの数を調整したい場合は tickAmount を追加
      tickAmount: 5, 
    },
    legend: {
      position: 'bottom',
    },
    tooltip: {
      theme: 'dark',
      y: {
        formatter: (value: number) => {
          const h = Math.floor(value / 60);
          const m = Math.round(value % 60);
          return h > 0 ? `${h}時間 ${m}分` : `${m}分`;
        }
      }
    },
  }

  return (
    <Chart
      options={options}
      series={series}
      type="bar"
      height={260}
    />
  )
}
export default BarChart