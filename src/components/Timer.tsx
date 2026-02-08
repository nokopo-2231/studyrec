// Timer.tsx
import { Play, Pause } from 'lucide-react' // アイコンライブラリを使用する場合
import styles from './Timer.module.css'

type Props = {
  seconds: number 
  isTimerRunning: boolean
  onToggle: () => void
  onSave: () => void
}

const formatHMS = (totalSeconds: number) => {
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60

  return `${String(h).padStart(2, '0')} : ${String(m).padStart(2, '0')} : ${String(s).padStart(2, '0')}`
}
const Timer = ({ seconds, isTimerRunning, onToggle, onSave }: Props) => {
  return (
    <div className={styles.timerContainer}>
      {/* 左エリア */}
      <div className={styles.leftArea}>
        <button type="button" className={styles.playButton} onClick={onToggle}>
          {isTimerRunning ? (
            <Pause size={20} fill="currentColor" />
          ) : (
            <Play size={20} fill="currentColor" />
          )}
        </button>
      </div>

      {/* 中央エリア：中身を中央寄せにする */}
      <div className={styles.centerArea}>
        <span className={styles.timerText}>{formatHMS(seconds)}</span>
      </div>

      {/* 右エリア：ボタンは条件付きで表示 */}
      <div className={styles.rightArea}>
        {!isTimerRunning && seconds !== 0 && (
          <button type="button" className={styles.saveButton} onClick={onSave}>
            {/* <Check size={16} /> */}
            <span>記録</span>
          </button>
        )}
      </div>
    </div>
  )
}

export default Timer