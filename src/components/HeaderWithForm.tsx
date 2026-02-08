import { useState, useEffect } from 'react'
import Header from './Header'
import StudyForm from './StudyForm'
import styles from './HeaderWithForm.module.css'
import logoutIcon from '../assets/images/Logout.png'

type Props = {
  date: string
  subject: string
  onSubjectChange: (v: string) => void
  onSubmit: (timerSeconds: number) => void 
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

  // 【修正】秒を 00 : 00 : 00 に整形
  // const formatTime = (s: number) => {
  //   const h = Math.floor(s / 3600).toString().padStart(2, '0')
  //   const m = Math.floor((s % 3600) / 60).toString().padStart(2, '0')
  //   const sec = (s % 60).toString().padStart(2, '0')
  //   return `${h} : ${m} : ${sec}`
  // }

  //停止して保存する処理
  const handleSave = () => {
    // seconds (数値) をそのまま App.tsx の addRecord へ渡す
    onSubmit(seconds) 
    setIsActive(false)
    setSeconds(0)
    setOpen(false)
  }

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <Header
          open={open}
          onToggle={() => setOpen(!open)}
          onSubmit={handleSave}
        />

        {open && (
          <section className={styles.formSection}>
            <StudyForm
              date={date}
              subject={subject}
              // formatTime で 00 : 00 : 00 になった文字列を渡す
              seconds={seconds}
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