import { SUBJECTS } from '../types/subject'
import styles from './StudyForm.module.css'

type Props = {
  date: string
  subject: string
  duration: string
  onDateChange: (value: string) => void
  onSubjectChange: (value: string) => void
  onDurationChange: (value: string) => void
  onSubmit: () => void
}

const StudyForm = ({
  date,
  subject,
  duration,
  onDateChange,
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
        <input
          type="date"
          className={styles.inputField}
          value={date}
          onChange={(e) => onDateChange(e.target.value)}
        />

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
