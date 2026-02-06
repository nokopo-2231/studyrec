import { SUBJECTS } from '../types/subject'
import styles from './StudyForm.module.css'

type Props = {
  date: string
  subject: string
  duration: string
  onSubjectChange: (value: string) => void
  onDurationChange: (value: string) => void
}

const StudyForm = ({
  date,
  subject,
  duration,
  onSubjectChange,
  onDurationChange,
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

        <input
          type="number"
          placeholder="分"
          className={styles.inputField}
          value={duration}
          onChange={(e) => onDurationChange(e.target.value)}
        />
      </div>
    </section>
  )
}

export default StudyForm
