import { useState } from 'react';
import type { StudyRecord } from '../types/study'


type Props = {
  record: StudyRecord
  onDelete: (id: string) => void
  onUpdate: (record: StudyRecord) => void
};


const StudyItem = ({ record, onDelete, onUpdate }: Props) => {
  const [isEditing, setIsEditing] = useState(false)
  const [subject, setSubject] = useState(record.subject)
  const [duration, setDuration] = useState(String(record.duration))
  

  return (
    <li>
      <div>{record.date}</div>

      {isEditing ? (
        <>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />

          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />

          <button
            onClick={() => {
              onUpdate({
                ...record,
                subject,
                duration: Number(duration),
              })
              setIsEditing(false)
            }}
          >
            保存
          </button>

          <button onClick={() => setIsEditing(false)}>
            キャンセル
          </button>
        </>
      ) : (
        <>
          <div>{record.subject}</div>
          <div>{record.duration} 分</div>

          <button onClick={() => setIsEditing(true)}>
            編集
          </button>

          <button onClick={() => onDelete(record.id)}>
            削除
          </button>
        </>
      )}
    </li>
  )
}

export default StudyItem
