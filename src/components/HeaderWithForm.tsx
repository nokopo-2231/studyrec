import { useState } from 'react'
import Header from './Header'
import StudyForm from './StudyForm'
import styles from './HeaderWithForm.module.css'

type Props = {
  date: string
  subject: string
  duration: string
  onDateChange: (v: string) => void
  onSubjectChange: (v: string) => void
  onDurationChange: (v: string) => void
  onSubmit: () => void
}

const HeaderWithForm = ({
    date,
    subject,
    duration,
    onDateChange,
    onSubjectChange,
    onDurationChange,
    onSubmit,
}: Props) => {
  
  const [open, setOpen] = useState(false)

  const handleSubmit = () => {
    onSubmit()
    setOpen(false) // フォームを閉じる
  }

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        {/* ロゴと追加ボタンの行 */}
        <Header
          open={open}
          onToggle={() => setOpen(!open)}
          onSubmit={handleSubmit}
        />

        {/* 下段のフォーム行 */}
        {open && (
          <section className={styles.formSection}>
            <StudyForm
              date={date}
              subject={subject}
              duration={duration}
              onDateChange={onDateChange}
              onSubjectChange={onSubjectChange}
              onDurationChange={onDurationChange}
              onSubmit={handleSubmit}
            />
          </section>
        )}
      </div>
    </div>
  )
}

export default HeaderWithForm