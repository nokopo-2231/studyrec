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

  // 1. 【修正】秒(number)を "HH : MM : SS" 形式にする
  const formatDuration = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = Math.floor(totalSeconds % 60);
    return `${String(h).padStart(2, '0')} : ${String(m).padStart(2, '0')} : ${String(s).padStart(2, '0')}`;
  };

  // ステートを文字列（"00 : 00 : 00"形式）で管理する
  const [durationStr, setDurationStr] = useState(formatDuration(record.duration));

  // 2. 【修正】保存時に "HH : MM : SS" を数値（秒）に変換する関数
  const parseToSeconds = (str: string) => {
    // 全角スペースやコロンが含まれても動くように trim し、数値化
    const parts = str.split(':').map(s => parseInt(s.trim()) || 0);
    
    if (parts.length === 3) {
      const [h, m, s] = parts;
      return (h * 3600) + (m * 60) + s;
    } 
    // もし "MM : SS" 形式で入力された場合のフォールバック
    else if (parts.length === 2) {
      const [m, s] = parts;
      return (m * 60) + s;
    }
    return Number(str) || 0;
  };

  const handleSave = () => {
    const numericSeconds = parseToSeconds(durationStr);
    onUpdate({ ...record, subject, duration: numericSeconds });
    setIsEditing(false);
  };

  return (
    <div className={styles.itemRow}>
      <div className={styles.subjectSide}>
        {isEditing ? (
          <input 
            className={styles.editInput}
            value={subject} 
            onChange={(e) => setSubject(e.target.value)} 
          />
        ) : (
          record.subject
        )}
      </div>

      <div className={styles.durationCenter}>
        {isEditing ? (
          <input 
            className={styles.editInput}
            type="text"
            value={durationStr} 
            placeholder="00 : 00 : 00"
            onChange={(e) => setDurationStr(e.target.value)} 
          />
        ) : (
          <span className={styles.durationText}>
            {formatDuration(record.duration)}
          </span>
        )}
      </div>

      <div className={styles.buttonSide}>
        {isEditing ? (
          <button className={styles.saveBtn} onClick={handleSave}>保存</button>
        ) : (
          <>
            <button className={styles.editBtn} onClick={() => {
              setSubject(record.subject);
              setDurationStr(formatDuration(record.duration));
              setIsEditing(true);
            }}>編集</button>
            <button className={styles.deleteBtn} onClick={() => onDelete(record.id)}>削除</button>
          </>
        )}
      </div>
    </div>
  );
};
export default StudyItem;