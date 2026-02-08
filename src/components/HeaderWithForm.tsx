import { useState, useEffect } from 'react'
import Header from './Header'
import StudyForm from './StudyForm'
import styles from './HeaderWithForm.module.css'
import logoutIcon from '../assets/images/Logout.png'

type Props = {
  date: string
  subject: string
  onSubjectChange: (v: string) => void
  onSubmit: (duration: string) => void // 保存時に時間を渡すため string 型を受け取るように変更
  onLogout: () => void
}

const HeaderWithForm = ({
    date,
    subject,
    onSubjectChange,
    onSubmit,
    onLogout,
}: Props) => {

  const [open, setOpen] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [isActive, setIsActive] = useState(false)

  //タイマーのカウントアップ
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null
    if (isActive) {
      interval = setInterval(() => setSeconds(s => s + 1), 1000)
    }
    return () => { if (interval) clearInterval(interval) }
  }, [isActive])

  //秒を 00:00 に整形
  const formatTime = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0')
    const sec = (s % 60).toString().padStart(2, '0')
    return `${m} : ${sec}`
  }

  //停止して保存する処理
  const handleSave = () => {
    onSubmit(formatTime(seconds)) // 親のRecord追加関数に渡す
    setIsActive(false)
    setSeconds(0)
    setOpen(false)
  }

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        {/* ロゴと追加ボタンの行 */}
        <Header
          open={open}
          onToggle={() => setOpen(!open)}
          onSubmit={handleSave}
        />

        {/* 下段のフォーム行 */}
        {open && (
          <section className={styles.formSection}>
            <StudyForm
              date={date}
              subject={subject}
              duration={formatTime(seconds)}
              onSubjectChange={onSubjectChange}
              isTimerRunning={isActive}
              onTimerToggle={() => setIsActive(!isActive)}
              onSave={handleSave}
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