import styles from './Monthly.module.css'
import type { StudyRecord } from '../types/study'

type Props = {
  records: StudyRecord[]
}

const Monthly = ({ records }: Props) => {
  const studyDates = records.map(r => r.date)
  const days = Array.from({ length: 31 }, (_, i) => i + 1)
  const startOffset = 4 // 木曜（0:日, 1:月 ...）


  // 計算ロジック
  const totalMinutes = records.reduce((sum, r) => sum + r.duration, 0)
  const totalHours = Math.floor(totalMinutes / 60)
  const remainingMinutes = totalMinutes % 60
  
  // 平均の計算 (1月=31日で計算)
  const avgMinutesTotal = Math.floor(totalMinutes / 31)
  const avgHours = Math.floor(avgMinutesTotal / 60)
  const avgMinutes = avgMinutesTotal % 60

  return (
    <section className={styles.monthly}>
      <div className={styles.container}>
       
        <div className={styles.header}>
          <span className={styles.arrow}>‹</span>
          <h3 className={styles.month}>1月</h3>
          <span className={styles.arrow}>›</span>
        </div>
        
        <div className={styles.calendar}>
          {Array.from({ length: startOffset }).map((_, i) => (
          <div key={`empty-${i}`} />
          ))}

          {days.map(day => {
            const dateStr = `2026-01-${String(day).padStart(2, '0')}`
            const isStudied = studyDates.includes(dateStr)

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
            <p className={styles.statLabel}>平均</p>
            <p className={styles.statValue}>
              <span className={styles.bigNum}>{avgHours}</span>時間
              <span className={styles.bigNum}>{avgMinutes}</span>分/日
            </p>
          </div>
          
          <div className={styles.divider}></div>
          
          <div className={styles.statBox}>
            <p className={styles.statLabel}>合計</p>
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
