import { useState, useMemo } from 'react'
import Chart from 'react-apexcharts'
import type { ApexOptions } from 'apexcharts'
import type { StudyRecord } from '../types/study'
import styles from './BarChart.module.css'

type Props = {
  records: StudyRecord[]
}

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export const BarChart = ({ records }: Props) => {
  const [weekOffset, setWeekOffset] = useState(0)

  // 1. 週の範囲を計算（依存：weekOffsetのみ）
  const range = useMemo(() => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const dayOfWeek = today.getDay()
    const diffToMonday = (dayOfWeek === 0 ? -6 : 1 - dayOfWeek) + (weekOffset * 7)
    
    const start = new Date(today)
    start.setDate(today.getDate() + diffToMonday)
    const end = new Date(start)
    end.setDate(start.getDate() + 6)
    end.setHours(23, 59, 59, 999) // 1日の終わりまで含める

    return { 
      start, 
      end, 
      label: `${start.getMonth() + 1}/${start.getDate()} - ${end.getMonth() + 1}/${end.getDate()}` 
    }
  }, [weekOffset])

  // 2. 最速の集計ロジック
  const series = useMemo(() => { // { series, subjectsFound } から series だけに変更
    const agg: Record<string, Record<string, number>> = {}
    const subjectsSet = new Set<string>()

    for (const r of records) {
      const d = new Date(r.date)
      if (d >= range.start && d <= range.end) {
        const dayName = d.toLocaleDateString('en-US', { weekday: 'short' })
        subjectsSet.add(r.subject)

        if (!agg[r.subject]) agg[r.subject] = {}
        agg[r.subject][dayName] = (agg[r.subject][dayName] || 0) + r.duration
      }
    }

    const subjectsArray = Array.from(subjectsSet)
    
    // ApexChartsの形式に整形して直接返す
    return subjectsArray.map(subject => ({
      name: subject,
      data: weekDays.map(day => {
        const seconds = agg[subject]?.[day] || 0
        return Math.round((seconds / 60) * 10) / 10
      })
    }))
  }, [records, range]) // 戻り値が series そのものになる

  // 3. チャート設定（初回のみ生成）
  const options: ApexOptions = useMemo(() => ({
    chart: { 
      type: 'bar', 
      stacked: true, 
      toolbar: { show: false },
      animations: { enabled: true, speed: 400 } 
    },
    plotOptions: { 
      bar: { borderRadius: 4, columnWidth: '60%', hideZeroBarsWhenStacked: true } 
    },
    xaxis: { categories: weekDays },
    yaxis: {
      labels: {
        formatter: (val) => {
          const h = Math.floor(val / 60)
          const m = Math.round(val % 60)
          return h > 0 ? `${h}h${m > 0 ? ` ${m}m` : ''}` : `${m}m`
        }
      },
      tickAmount: 5
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: { formatter: (val) => `${Math.floor(val / 60)}時間 ${Math.round(val % 60)}分` }
    },
    legend: { position: 'bottom', horizontalAlign: 'center' },
    noData: { text: '今週のデータはありません', style: { color: '#999', fontSize: '14px' } }
  }), [])

  return (
  <div className={styles.container}>
    <div className={styles.header}>
      <button 
        className={styles.navButton}
        onClick={() => setWeekOffset(prev => prev - 1)}
        aria-label="先週へ"
      >
        ←
      </button>

      <div className={styles.titleGroup}>
        <h3 className={styles.title}>
          {weekOffset === 0 ? '今週の学習' : weekOffset === -1 ? '先週の学習' : `${Math.abs(weekOffset)}週間前`}
        </h3>
        <p className={styles.dateRange}>{range.label}</p>
      </div>

      <button 
        className={styles.navButton}
        onClick={() => setWeekOffset(prev => prev + 1)} 
        disabled={weekOffset >= 0}
        aria-label="次週へ"
      >
        →
      </button>
    </div>
    
    <Chart options={options} series={series} type="bar" height={280} />
  </div>
)
}

export default BarChart