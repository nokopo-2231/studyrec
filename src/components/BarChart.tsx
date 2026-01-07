import Chart from 'react-apexcharts'
import type { ApexOptions } from 'apexcharts'
import type { StudyRecord } from '../types/study'

type Props = {
  records: StudyRecord[]
}

// 表示する曜日（1週間）
const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

// 日付 → 曜日（Mon形式）
const getWeekDay = (date: string) =>
  new Date(date).toLocaleDateString('en-US', { weekday: 'short' })

export const BarChart = ({ records }: Props) => {
  
  // 教科一覧を抽出
  const subjects = Array.from(new Set(records.map(r => r.subject)))

  // 教科ごとの積み上げデータを作成
  const series = subjects.map(subject => ({
    name: subject,
    data: weekDays.map(day =>
      records
        .filter(
          r => r.subject === subject && getWeekDay(r.date) === day
        )
        .reduce((sum, r) => sum + r.duration, 0)
    ),
  }))

  const options: ApexOptions = {
    chart: {
      type: 'bar',
      stacked: true, // ← 積み上げ
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
        formatter: (value: number) =>
        value >= 60 ? `${Math.floor(value / 60)}h ${value % 60}m` : `${value}min`,
        style: { fontSize: '12px' },
      },
    },
    legend: {
      position: 'bottom',
    },
    tooltip: {
      theme: 'dark',
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