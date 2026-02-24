import { useState, useEffect } from 'react'
import './App.css'
import HeaderWithForm from './components/HeaderWithForm'
import Monthly from './components/Monthly'
import StudyList from './components/StudyList'
import { BarChart } from './components/BarChart'
import type { StudyRecord } from './types/study'
import Ranking from './components/Ranking'
import { db, analytics, auth, googleProvider } from "./firebase"; 
import { logEvent } from "firebase/analytics"; 
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc, query, where } from "firebase/firestore"; 
import { signInWithPopup, onAuthStateChanged, signOut, type User } from "firebase/auth"; 
import AIComment from './components/AIComment'
import { fetchAiComment } from './services/gemini';

function App() {
  // --- 基本設定 ---
  const getToday = () => new Date().toISOString().slice(0, 10)
  const [date] = useState(getToday())

  // --- 教科の状態管理 (localStorageから復元) ---
  const [subject, setSubject] = useState(() => {
    return localStorage.getItem("studySelectedSubject") || ''
  })

  const handleSubjectChange = (val: string) => {
    setSubject(val);
    localStorage.setItem("studySelectedSubject", val);
  }

  // --- 状態管理 ---
  const [records, setRecords] = useState<StudyRecord[]>([])
  const [user, setUser] = useState<User | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date())
  const [loading, setLoading] = useState(true);

  // --- AI関連 ---
  const [aiMsg, setAiMsg] = useState("今日は何から始める？")
  const [isAiOpen, setIsAiOpen] = useState(false)

  // --- 認証 (Firebase Auth) ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setAiMsg(`${currentUser.displayName || 'ユーザー'}さん、おかえりなさい！`)
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // --- ログイン・ログアウト ---
  const login = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("ログイン失敗:", error);
    }
  };

  const logout = () => signOut(auth);

  // --- Firestore操作 (CRUD) ---

  // 1. 取得 (Read)
  const fetchRecords = async () => {
    if (!user) return;
    try {
      const q = query(collection(db, "records"), where("uid", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const loadedRecords = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as StudyRecord[];
      setRecords(loadedRecords);
    } catch (e) {
      console.error("読み込みエラー:", e);
    }
  };

  useEffect(() => {
    if (user) {
      fetchRecords();
      if (analytics) logEvent(analytics, 'page_view', { page_title: 'StudyAppMain' });
    } else {
      setRecords([]); 
    }
  }, [user]);

  // 2. 追加 (Create)
  const addRecord = async (secondsFromTimer: number) => {
    if (!user || !subject || secondsFromTimer === 0) {
      alert("科目を選択してタイマーを計測してください")
      return
    }

    try {
      // Firebaseに保存
      const docRef = await addDoc(collection(db, "records"), {
        uid: user.uid,
        date,
        subject,
        duration: secondsFromTimer,
        createdAt: new Date(),
      })

      const newRecord: StudyRecord = {
        id: docRef.id,
        date,
        subject,
        duration: secondsFromTimer,
      }

      // ローカルStateの更新
      const updatedRecords = [...records, newRecord];
      setRecords(updatedRecords);

      // 保存成功時に各キャッシュをクリア
      setSubject('');
      localStorage.removeItem("studySelectedSubject");
      localStorage.removeItem("studyStartTime");
      localStorage.removeItem("studyAccumulatedTime");

      // AIの呼び出し
      const minutes = Math.floor(secondsFromTimer / 60);
      const comment = await fetchAiComment(subject, minutes, updatedRecords);
      setAiMsg(comment);
      setIsAiOpen(true);

      if (analytics) {
        logEvent(analytics, 'add_study_record', { subject, seconds: secondsFromTimer });
      }

      alert("自分専用のクラウドに保存しました！")
    } catch (e) {
      console.error("保存失敗:", e)
      alert("保存に失敗しました。")
    }
  }

  // 3. 削除 (Delete)
  const deleteRecord = async (id: string) => {
    try {
      await deleteDoc(doc(db, "records", id));
      setRecords(prev => prev.filter(r => r.id !== id));
    } catch (e) {
      console.error("削除失敗: ", e);
    }
  };

  // 4. 更新 (Update)
  const updateRecord = async (updated: StudyRecord) => {
    try {
      const recordRef = doc(db, "records", updated.id);
      await updateDoc(recordRef, {
        date: updated.date,
        subject: updated.subject,
        duration: updated.duration
      });
      setRecords(prev => prev.map(r => r.id === updated.id ? updated : r));
    } catch (e) {
      console.error("更新失敗:", e);
    }
  };

  // --- 表示用フィルタリング ---
  const monthlyRecords = records.filter(r => {
    const d = new Date(r.date)
    return d.getFullYear() === currentDate.getFullYear() && 
           d.getMonth() === currentDate.getMonth()
  })

  const weeklyRecords = records.filter((r) => {
    const baseDate = new Date(currentDate);
    const day = baseDate.getDay();
    const diffToMon = day === 0 ? -6 : 1 - day; 
    const monday = new Date(baseDate);
    monday.setDate(baseDate.getDate() + diffToMon);
    monday.setHours(0, 0, 0, 0);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    const recordDate = new Date(r.date);
    return recordDate >= monday && recordDate <= sunday;
  });

  const handleDateChange = (newDate: Date) => setCurrentDate(newDate);

  const handleDateSelect = (newDate: Date) => {
    setCurrentDate(newDate);
    const section = document.querySelector('.sectionTitle2');
    if (section) section.scrollIntoView({ behavior: 'smooth' });
  };

  // --- レンダリング ---
  if (loading) return <div>Loading...</div>;

  if (!user) {
    return (
      <div className="login-container" style={{ textAlign: 'center', marginTop: '100px' }}>
        <h1>学習管理アプリ</h1>
        <p>ログインすると、あなた専用の学習記録を保存できます。</p>
        <button onClick={login} style={{ padding: '10px 20px', fontSize: '1.2rem', cursor: 'pointer' }}>
          Googleでログインして始める
        </button>
      </div>
    );
  }

  return (
    <div className="app">
      <header>
        <HeaderWithForm 
            date={date}
            subject={subject}
            onSubjectChange={handleSubjectChange}
            onSubmit={addRecord}
            onLogout={logout}
          />
      </header>

      <main>
        <h2 className="sectionTitle1">MONTHLY</h2>
        <div className="card">
          <Monthly 
            records={records}
            viewDate={currentDate}
            onDateChange={handleDateChange}
            onDateSelect={handleDateSelect}
          />
        </div>
        <div className="card"><Ranking records={monthlyRecords} /></div>
        <div className="card"><BarChart records={monthlyRecords} /></div>
        
        <h2 className="sectionTitle2">RECORD (今週の記録)</h2>
        <StudyList 
          records={weeklyRecords} 
          targetDate={currentDate}
          onDelete={deleteRecord} 
          onUpdate={updateRecord} 
        /> 
      </main>

      <AIComment 
        message={aiMsg} 
        isOpen={isAiOpen} 
        setIsOpen={setIsAiOpen} 
      />
    </div>
  );
}

export default App;