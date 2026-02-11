import { useState, useEffect, useRef } from 'react'
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
  // 停止した時点までの経過秒数を保持する
  const [accumulatedTime, setAccumulatedTime] = useState(0)

  // Wake Lockの状態を保持する変数
  const wakeLockRef = useRef<any>(null)

  // 画面スリープ防止をリクエストする関数
  const requestWakeLock = async () => {
    if ('wakeLock' in navigator) {
      try {
        wakeLockRef.current = await (navigator as any).wakeLock.request('screen');
        console.log('画面常時点灯：有効');
      } catch (err) {
        console.error('Wake Lock失敗:', err);
      }
    }
  };

  // スリープ防止を解除する関数
  const releaseWakeLock = async () => {
    if (wakeLockRef.current !== null) {
      await wakeLockRef.current.release();
      wakeLockRef.current = null;
      console.log('画面常時点灯：解除');
    }
  };

  // タイマーのカウントアップ & スリープ制御
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null
    
    if (isActive) {
      // タイマー開始時にスリープ防止
      requestWakeLock();
      
      // 時刻差分方式で計算（スリープ対策）
      const startTime = Date.now() - accumulatedTime * 1000;
      interval = setInterval(() => {
        // 常に「開始時刻との差」を表示するので、スリープしてもズレない
        setSeconds(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
      
    } else {
      // 停止時に合計時間を保存し、スリープ防止を解除
      setAccumulatedTime(seconds);
      releaseWakeLock();
    }
    
    return () => {
      if (interval) clearInterval(interval);
      // コンポーネントが消えるときも解除
      releaseWakeLock();
    };
  }, [isActive]);

  //停止して保存する処理
  const handleSave = () => {
    // seconds (数値) をそのまま App.tsx の addRecord へ渡す
    onSubmit(seconds) 
    setIsActive(false)
    setSeconds(0)
    setAccumulatedTime(0) // リセット
    setOpen(false)
    releaseWakeLock(); // 保存時も確実に解除
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