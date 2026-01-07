import { useState } from 'react'
import './App.css'
import HeaderWithForm from './components/HeaderWithForm'
import Monthly from './components/Monthly'
import StudyList from './components/StudyList'
import { BarChart } from './components/BarChart'
import type { StudyRecord } from './types/study'



function App() {
  const [date, setDate] = useState('')
  const [subject, setSubject] = useState('')
  const [duration, setDuration] = useState('')
  const [records, setRecords] = useState<StudyRecord[]>([])


  const addRecord = () => {
    if (!date || !subject || !duration) return

    const newRecord: StudyRecord = {
      id: crypto.randomUUID(),
      date,
      subject,
      duration: Number(duration),
    }

    setRecords(prev => [...prev, newRecord])
  }


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
          <BarChart records={records} />
        </div>

        <h2 className="sectionTitle">RECORD</h2>
        <div className="card">
          <StudyList
            records={records}
            onDelete={deleteRecord}
            onUpdate={updateRecord}
          />
        </div>
      </main>

    </div>
  )
}

export default App
