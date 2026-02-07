import { useState } from 'react'
import Header from './Header'
import StudyForm from './StudyForm'
import styles from './HeaderWithForm.module.css'
import logoutIcon from '../assets/images/Logout.png'

type Props = {
  date: string
  subject: string
  duration: string
  onSubjectChange: (v: string) => void
  onDurationChange: (v: string) => void
  onSubmit: () => void
  onLogout: () => void
}

const HeaderWithForm = ({
    date,
    subject,
    duration,
    onSubjectChange,
    onDurationChange,
    onSubmit,
    onLogout,
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
              onSubjectChange={onSubjectChange}
              onDurationChange={onDurationChange}
            />

            <div className={styles.logoutArea}>
              <button
                type="button"
                onClick={onLogout}
                className={styles.logoutButton}
              >
                <span>LOG OUT</span>
                <img
                  src={logoutIcon}
                  alt=""
                  className={styles.logoutIcon}
                />
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

export default HeaderWithForm