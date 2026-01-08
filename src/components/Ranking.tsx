import styles from './Ranking.module.css'
import type { StudyRecord } from '../types/study'

type Props = {
  records: StudyRecord[]
}

const Ranking = ({ records }: Props) => {
  // 教科ごとに時間を合計する
  const rankingMap = records.reduce((acc, cur) => {
    acc[cur.subject] = (acc[cur.subject] || 0) + cur.duration
    return acc
  }, {} as Record<string, number>)

  // 配列に変換して降順（多い順）にソート
  const sortedRanking = Object.entries(rankingMap)
    .map(([subject, duration]) => ({ subject, duration }))
    .sort((a, b) => b.duration - a.duration)

  return (
    <div className={styles.rankingContainer}>
      <div className={styles.titleArea}>
        <span className={styles.crown}>👑</span>
        <p className={styles.titleText}>勉強した教科ランキング</p>
      </div>

      <div className={styles.list}>
        {sortedRanking.map((item, index) => {
          // 時間と分を計算
          const hours = Math.floor(item.duration / 60)
          const minutes = item.duration % 60

          return (
            <div 
              key={item.subject} 
              className={`${styles.rankItem} ${styles[`rank${index}`]}`}
            >
              <span className={styles.subject}>{item.subject.toUpperCase()}</span>
              
              {/* 統計部分と同じデザインを適用 */}
              <div className={styles.durationValue}>
                <span className={styles.bigNum}>{hours}</span>
                <span className={styles.unit}>時間</span>
                {minutes > 0 && (
                  <>
                    <span className={styles.bigNum}>{minutes}</span>
                    <span className={styles.unit}>分</span>
                  </>
                )}
              </div>
            </div>
          )
        })}
        
        {sortedRanking.length === 0 && (
          <p className={styles.empty}>記録がありません</p>
        )}
      </div>
    </div>
  )
}

export default Ranking