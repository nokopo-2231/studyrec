import { useState, useEffect } from 'react'
import './App.css'
import HeaderWithForm from './components/HeaderWithForm'
import Monthly from './components/Monthly'
import StudyList from './components/StudyList'
import { BarChart } from './components/BarChart'
import type { StudyRecord } from './types/study'
import Ranking from './components/Ranking'
import { db } from "./firebase"; 
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";


function App() {
  const [date, setDate] = useState('')
  const [subject, setSubject] = useState('')
  const [duration, setDuration] = useState('')
  const [records, setRecords] = useState<StudyRecord[]>([])

//ページ読み込み時にFirestoreからデータを取得 (Read)
  useEffect(() => {
    const fetchRecords = async () => {
      try {
        // "records"コレクションからデータを取得
        const querySnapshot = await getDocs(collection(db, "records"));
        const loadedRecords = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as StudyRecord[];

        // 取得したデータを画面のstateにセット
        setRecords(loadedRecords);
        } catch (e) {
        console.error("読み込みエラー:", e);
      }
    };

    fetchRecords();
    }, []); // [] は「初回のみ実行」の意味

    //記録を追加してFirestoreに保存 (Create)
    const addRecord = async () => {
      if (!date || !subject || !duration) return;
    

      try {
        // Firestore にデータを保存
        const docRef = await addDoc(collection(db, "records"), {
          date,
          subject,
          duration: Number(duration),
          createdAt: new Date(), 
        });

        // 画面表示用の新しいレコード
          const newRecord: StudyRecord = {
            id: docRef.id,
            date,
            subject,
            duration: Number(duration),
          };

          // フィルタリング計算（既存のロジック）
          const now = new Date();
          const day = now.getDay();
          const diffToMon = day === 0 ? -6 : 1 - day; 
          const monday = new Date(now);
          monday.setDate(now.getDate() + diffToMon);
          monday.setHours(0, 0, 0, 0);
          const sunday = new Date(monday);
          sunday.setDate(monday.getDate() + 6);
          sunday.setHours(23, 59, 59, 999);

          setRecords((prev) => {
            const updated = [...prev, newRecord];
            return updated.filter((r) => {
              const recordDate = new Date(r.date);
              return recordDate >= monday && recordDate <= sunday;
            });
          });

          setSubject('');
          setDuration('');
          alert("クラウドに保存しました！");
        } catch (e) {
          console.error("保存失敗:", e);
        }
      };

    // レコード削除
    const deleteRecord = async (id: string) => {
      try {
        // 1. Firestore から削除
        await deleteDoc(doc(db, "records", id));

        // 2. 画面（State）から削除
        setRecords(prev => prev.filter(r => r.id !== id));
        
        console.log("削除完了！");
      } catch (e) {
        console.error("削除に失敗しました: ", e);
      }
    };

    // レコード更新
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

  return (
    <div className="app">
      <header>
        <HeaderWithForm 
            date={date}
            subject={subject}
            duration={duration}
            onDateChange={setDate}
            onSubjectChange={setSubject}
            onDurationChange={setDuration}
            onSubmit={addRecord}
          />
      </header>

      <main>
        <h2 className="sectionTitle">MONTHLY</h2>
        <div className="card">
          <Monthly records={records} />
        </div>

        <div className="card">
          <Ranking records={records} />
        </div>

        <div className="card">
          <BarChart records={records} />
        </div>

        <h2 className="sectionTitle">RECORD</h2>
          <StudyList
            records={records}
            onDelete={deleteRecord}
            onUpdate={updateRecord}
          /> 
      </main>

    </div>
  )
}

export default App
