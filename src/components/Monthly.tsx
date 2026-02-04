import styles from './Monthly.module.css'
import type { StudyRecord } from '../types/study'

type Props = {
  records: StudyRecord[]
  viewDate: Date 
  onDateChange: (d: Date) => void 
}

const normalizeDate = (dateStr: string) => {
  const d = new Date(dateStr)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const Monthly = ({ records, viewDate, onDateChange }: Props) => {
  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()

  const changeMonth = (offset: number) => {
    const nextDate = new Date(year, month + offset, 1)
    onDateChange(nextDate)
  }

  const firstDayOfMonth = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)


  // 表示中の月のデータだけを抽出
  const filteredRecords = records.filter(r => {
  const normalized = normalizeDate(r.date)
  const d = new Date(normalized + 'T00:00:00')
    return d.getFullYear() === year && d.getMonth() === month
  })

//   console.log(
//   filteredRecords.map(r => normalizeDate(r.date))
// )

  // 合計時間の計算
  const totalMinutes = filteredRecords.reduce((sum, r) => sum + r.duration, 0)
  const totalHours = Math.floor(totalMinutes / 60)
  const remainingMinutes = totalMinutes % 60
  
  // 勉強した日数の計算
  const studiedDaysCount = new Set(
    filteredRecords.map(r => normalizeDate(r.date))
  ).size

  // 平均の計算
  const avgMinutesTotal =
  studiedDaysCount > 0
    ? Math.floor(totalMinutes / studiedDaysCount)
    : 0

  const avgHours = Math.floor(avgMinutesTotal / 60)
  const avgMinutes = avgMinutesTotal % 60

  return (
    <section className={styles.monthly}>
      <div className={styles.container}>
       
        <div className={styles.header}>
          <span className={styles.arrow} onClick={() => changeMonth(-1)} style={{ cursor: 'pointer' }}>‹</span>
          <h3 className={styles.month}>{year}年 {month + 1}月</h3>
          <span className={styles.arrow} onClick={() => changeMonth(1)} style={{ cursor: 'pointer' }}>›</span>
        </div>
        
        <div className={styles.calendar}>
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} />
          ))}

          {days.map(day => {
            // カレンダー上の各日付が勉強済みかチェック
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
            const isStudied = filteredRecords.some(
              r => normalizeDate(r.date) === dateStr
            )

            return (
              <div
              key={day}
              className={isStudied ? styles.activeDay : styles.day}
              >
              {day}
              </div>
            )
          })}
        </div>

        <div className={styles.statsContainer}>
          <div className={styles.statBox}>
            <p className={styles.statLabel}>月平均</p>
            <p className={styles.statValue}>
              <span className={styles.bigNum}>{avgHours}</span>時間
              <span className={styles.bigNum}>{avgMinutes}</span>分/日
            </p>
          </div>
          
          <div className={styles.divider}></div>
          
          <div className={styles.statBox}>
            <p className={styles.statLabel}>月合計</p>
            <p className={styles.statValue}>
              <span className={styles.bigNum}>{totalHours}</span>時間
              <span className={styles.bigNum}>{remainingMinutes}</span>分
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Monthly
