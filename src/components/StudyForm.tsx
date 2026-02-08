import Timer from './Timer'
import { SUBJECTS } from '../types/subject'
import styles from './StudyForm.module.css'

type Props = {
  date: string
  subject: string
  seconds: number // ← duration (string) から seconds (number) に変更
  isTimerRunning: boolean
  onSubjectChange: (value: string) => void
  onTimerToggle: () => void
  onSave: () => void
}

const StudyForm = ({
  date,
  subject,
  seconds, // ← 受け取る名前を変更
  isTimerRunning,
  onSubjectChange,
  onTimerToggle,
  onSave,
}: Props) => {
  
  return (
    <section>
      {/* 上部：タイトルとボタンのエリア */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
           {/* アイコンとStudy Recordのテキスト（既存のまま） */}
        </div>
      </div>

      {/* 下部：入力欄のエリア */}
      <div className={styles.formRow}>

        <div className={`${styles.inputField} ${styles.dateBox}`}>
          Today : {date}
        </div>

        <select
          className={styles.inputField}
          value={subject}
          onChange={(e) => onSubjectChange(e.target.value)}
        >
          <option value="">科目を選択</option>
          {SUBJECTS.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <Timer 
          seconds={seconds}
          isTimerRunning={isTimerRunning} 
          onToggle={onTimerToggle}
          onSave={onSave}
        />
      </div>
    </section>
  )
}

export default StudyForm
