// Timer.tsx
import { Play, Pause, Check } from 'lucide-react' // アイコンライブラリを使用する場合
import styles from './Timer.module.css'

type Props = {
  duration: string
  isTimerRunning: boolean
  onToggle: () => void
  onSave: () => void
}

const Timer = ({ duration, isTimerRunning, onToggle, onSave }: Props) => {
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
        <span className={styles.timerText}>{duration || '00 : 00'}</span>
      </div>

      {/* 右エリア：ボタンは条件付きで表示 */}
      <div className={styles.rightArea}>
        {!isTimerRunning && duration !== '00 : 00' && (
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