import { useState } from 'react';
import type { StudyRecord } from '../types/study'
import styles from './StudyList.module.css'

type Props = {
  record: StudyRecord
  onDelete: (id: string) => void
  onUpdate: (record: StudyRecord) => void
};

const StudyItem = ({ record, onDelete, onUpdate }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [subject, setSubject] = useState(record.subject);
  const [duration, setDuration] = useState(String(record.duration));

  return (
    <div className={styles.itemRow}>
      {/* 左側：日付の代わりに「科目」を表示 */}
      <div className={styles.subjectSide}>{record.subject}</div>

      {/* 中央：時間は「数値」のみ表示 */}
      <div className={styles.durationCenter}>
        {isEditing ? (
          <div className={styles.editInputs}>
            <input value={subject} onChange={(e) => setSubject(e.target.value)} />
            <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} />
          </div>
        ) : (
          <span className={styles.durationText}>{record.duration}min</span>
        )}
      </div>

      {/* 右側：ボタン */}
      <div className={styles.buttonSide}>
        {isEditing ? (
          <button className={styles.saveBtn} onClick={() => {
            onUpdate({ ...record, subject, duration: Number(duration) });
            setIsEditing(false);
          }}>保存</button>
        ) : (
          <>
            <button className={styles.editBtn} onClick={() => setIsEditing(true)}>編集</button>
            <button className={styles.deleteBtn} onClick={() => onDelete(record.id)}>削除</button>
          </>
        )}
      </div>
    </div>
  );
};

export default StudyItem