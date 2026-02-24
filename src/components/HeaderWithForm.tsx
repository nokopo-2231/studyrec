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
  // タイマーの状態管理
  const [seconds, setSeconds] = useState(0)
  const [isActive, setIsActive] = useState(false)

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

  // --- useEffect 1: 初回読み込み時の復元 ---
  useEffect(() => {
    const savedStartTime = localStorage.getItem("studyStartTime"); 
    const savedAccumulated = localStorage.getItem("studyAccumulatedTime");

    if (savedStartTime) {
     // 1. 実行中だった場合：現在の時刻から開始時刻を引いて、経過秒数を即座に計算
      const start = Number(savedStartTime);
      const currentSeconds = Math.floor((Date.now() - start) / 1000);
      setSeconds(currentSeconds);
      setIsActive(true);
    } else if (savedAccumulated) {
      // 2. 停止中だがデータがある場合
      setSeconds(Number(savedAccumulated));
    }
  }, []);

  // --- useEffect 2: タイマーのメインロジック ---
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    
    if (isActive) {
      requestWakeLock();
      
      let startTimeStr = localStorage.getItem("studyStartTime");
      if (!startTimeStr) {
        // 停止状態から新しく開始する場合のみ、新しく開始時刻を保存
        const startTime = Date.now() - (seconds * 1000);
        startTimeStr = startTime.toString();
        localStorage.setItem("studyStartTime", startTimeStr);
      }

      const startTime = Number(startTimeStr);
      
      interval = setInterval(() => {
        const nextSeconds = Math.floor((Date.now() - startTime) / 1000);
        setSeconds(nextSeconds);
      }, 1000);

    } else {
      // 停止した時
      releaseWakeLock();
    if (interval) clearInterval(interval);
    
    // 停止した瞬間の秒数を確定させて保存し、開始時刻を消す
    if (seconds > 0) {
      localStorage.setItem("studyAccumulatedTime", seconds.toString());
    }
    localStorage.removeItem("studyStartTime");
  }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive]); // secondsを依存配列に入れるとループするのでisActiveだけでOK

  // --- 保存処理 ---
  const handleSave = () => {
    onSubmit(seconds);
    setIsActive(false);
    setSeconds(0);
    // すべてのタイマー用キャッシュを削除
    localStorage.removeItem("studyStartTime");
    localStorage.removeItem("studyAccumulatedTime");
    setOpen(false);
    releaseWakeLock();
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