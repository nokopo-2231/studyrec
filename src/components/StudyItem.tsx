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

  const formatDuration = (totalSeconds: number) => {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;

  const hDisplay = h > 0 ? `${h}時間` : "";
  const mDisplay = m > 0 ? `${m}分` : (h > 0 ? "0分" : ""); // 時間がある時は0分も表示
  const sDisplay = `${s}秒`;

  return `${hDisplay}${mDisplay}${sDisplay}`;
};

  return (
    <div className={styles.itemRow}>
      {/* 左側：日付の代わりに「科目」を表示 */}
      <div className={styles.subjectSide}>{record.subject}</div>

      {/* 中央：時間は「数値」のみ表示 */}
      <div className={styles.durationCenter}>
        {isEditing ? (
          <div className={styles.editInputs}>
            <input 
              className={styles.editInput}
              value={subject} 
              onChange={(e) => setSubject(e.target.value)} />
            <input 
              className={styles.editInput}
              type="number" 
              value={duration} 
              onChange={(e) => setDuration(e.target.value)} />
          </div>
        ) : (
          <span className={styles.durationText}>
            {formatDuration(record.duration)}
          </span>
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