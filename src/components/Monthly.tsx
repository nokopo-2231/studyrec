import styles from './Monthly.module.css'
import type { StudyRecord } from '../types/study'

type Props = {
  records: StudyRecord[]
}

const Monthly = ({ records }: Props) => {
  const studyDates = records.map(r => r.date)
  const days = Array.from({ length: 31 }, (_, i) => i + 1)
  const startOffset = 4 // 木曜（0:日, 1:月 ...）


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

      </div>
    </section>
  )
}

export default Monthly
