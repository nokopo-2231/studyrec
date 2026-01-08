import { useState } from 'react'
import './App.css'
import HeaderWithForm from './components/HeaderWithForm'
import Monthly from './components/Monthly'
import StudyList from './components/StudyList'
import { BarChart } from './components/BarChart'
import type { StudyRecord } from './types/study'
import Ranking from './components/Ranking'



function App() {
  const [date, setDate] = useState('')
  const [subject, setSubject] = useState('')
  const [duration, setDuration] = useState('')
  const [records, setRecords] = useState<StudyRecord[]>([])


  // App.tsx の addRecord を以下に差し替え
const addRecord = () => {
  if (!date || !subject || !duration) return;

  const newRecord: StudyRecord = {
    id: crypto.randomUUID(),
    date, // "YYYY-MM-DD" 形式
    subject,
    duration: Number(duration),
  };

  setRecords((prev) => {
    // 1. 新しいレコードを追加
    const updated = [...prev, newRecord];

    // 2. 今週の月曜日と日曜日の範囲を計算
    const now = new Date();
    const day = now.getDay(); // 0(日)〜6(土)
    const diffToMon = day === 0 ? -6 : 1 - day; 
    
    // 月曜日の 00:00:00
    const monday = new Date(now);
    monday.setDate(now.getDate() + diffToMon);
    monday.setHours(0, 0, 0, 0);

    // 日曜日の 23:59:59
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    // 3. 月〜日の範囲内のデータだけを残す（かつ、同じ日の同じ科目を重複させないならここで調整も可能）
    return updated.filter((r) => {
      const recordDate = new Date(r.date);
      return recordDate >= monday && recordDate <= sunday;
    });
  });

  // 入力フォームをリセット
  setSubject('');
  setDuration('');
};


  // const totalMinutes = records.reduce(
  //     (sum, r) => sum + r.duration,
  //     0
  //   );

  // レコード削除
  const deleteRecord = (id: string) => {
    setRecords(prev => prev.filter(r => r.id !== id))
  };

  // レコード更新
  const updateRecord = (updated: StudyRecord) => {
  setRecords(prev =>
    prev.map(r => r.id === updated.id ? updated : r)
  )
}


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
