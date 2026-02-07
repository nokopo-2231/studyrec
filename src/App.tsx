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

function App() {
  // 今日の日付を"YYYY-MM-DD"形式で取得（固定）
  const getToday = () =>
  new Date().toISOString().slice(0, 10)
  const [date] = useState(getToday())

  const [subject, setSubject] = useState('')
  const [duration, setDuration] = useState('')
  const [records, setRecords] = useState<StudyRecord[]>([])
  const [user, setUser] = useState<User | null>(null);
  // 表示中の月を親で管理する
  const [currentDate, setCurrentDate] = useState(new Date())

  // 1. ログイン状態の監視
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // 2. ログイン時のみデータを取得
  useEffect(() => {
    if (analytics) {
      logEvent(analytics, 'page_view', { page_title: 'StudyAppMain' });
    }

    if (user) {
      fetchRecords();
    } else {
      setRecords([]); 
    }
  }, [user]);

  const login = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("ログイン失敗:", error);
    }
  };

  const logout = () => signOut(auth);

  // --- Firestore操作 ---

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

  const addRecord = async () => {
    if (!user || !subject || !duration) return;
    try {
      const docRef = await addDoc(collection(db, "records"), {
        uid: user.uid,
        date,
        subject,
        duration: Number(duration),
        createdAt: new Date(), 
      });

      if (analytics) {
        logEvent(analytics, 'add_study_record', { subject, duration: Number(duration) });
      }

      const newRecord: StudyRecord = {
        id: docRef.id,
        date,
        subject,
        duration: Number(duration),
      };

      // recordsには全データを追加（Monthly表示用）
      setRecords((prev) => [...prev, newRecord]);

      setSubject('');
      setDuration('');
      alert("自分専用のクラウドに保存しました！");
    } catch (e) {
      console.error("保存失敗:", e);
    }
  };

  const deleteRecord = async (id: string) => {
    try {
      await deleteDoc(doc(db, "records", id));
      setRecords(prev => prev.filter(r => r.id !== id));
    } catch (e) {
      console.error("削除失敗: ", e);
    }
  };

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

  // --- フィルタリングロジック ---
  // RankingやMonthlyの統計用に「表示中の月」だけでフィルタリング
  const monthlyRecords = records.filter(r => {
    const d = new Date(r.date)
    return d.getFullYear() === currentDate.getFullYear() && 
           d.getMonth() === currentDate.getMonth()
  })

  // StudyList（RECORDセクション）に表示する「今週分」のデータを抽出
  const weeklyRecords = records.filter((r) => {
    const now = new Date();
    const day = now.getDay();
    // 月曜日を週の始まりとする計算
    const diffToMon = day === 0 ? -6 : 1 - day; 
    const monday = new Date(now);
    monday.setDate(now.getDate() + diffToMon);
    monday.setHours(0, 0, 0, 0);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    const recordDate = new Date(r.date);
    return recordDate >= monday && recordDate <= sunday;
  });

  // --- 表示分岐 ---

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
            duration={duration}
            onSubjectChange={setSubject}
            onDurationChange={setDuration}
            onSubmit={addRecord}
            onLogout={logout}
          />
      </header>

      <main>
        <h2 className="sectionTitle1">MONTHLY</h2>
        {/* 月間カレンダーには全データを渡す */}
        <div className="card">
          <Monthly 
            records={records}
            viewDate={currentDate} // 状態を渡す
            onDateChange={setCurrentDate} // 変更関数を渡す
          />
        </div>
        <div className="card">
          <Ranking records={monthlyRecords} />
        </div>
        <div className="card">
          <BarChart records={monthlyRecords} />
        </div>
        
        <h2 className="sectionTitle2">RECORD (今週の記録)</h2>
        {/* 下のリストには今週分だけを渡す */}
        <StudyList 
          records={weeklyRecords} 
          onDelete={deleteRecord} 
          onUpdate={updateRecord} 
        /> 
      </main>
    </div>
  );
}

export default App;