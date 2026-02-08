import StudyItem from './StudyItem'
import type { StudyRecord } from '../types/study'
import styles from './StudyList.module.css'

type Props = {
  records: StudyRecord[]
  onDelete: (id: string) => void
  onUpdate: (record: StudyRecord) => void
}

const StudyList = ({ records, onDelete, onUpdate }: Props) => {
  // 今週の月曜日から日曜日までの日付文字列(YYYY-MM-DD)の配列を作る
  const getWeekDates = () => {
    const now = new Date();
    const day = now.getDay();
    // 日曜日(0)を週の最後にするための調整
    const diffToMon = day === 0 ? -6 : 1 - day;
    const monday = new Date(now);
    monday.setDate(now.getDate() + diffToMon);

    return [...Array(7)].map((_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      // ローカルの日付を YYYY-MM-DD 形式で取得
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    });
  };

  const weekDates = getWeekDates();

  return (
    <ul className={styles.list}>
      {weekDates.map((dateStr) => {
        // その日のレコードを探す
        const dayRecords = records.filter((r) => r.date === dateStr);

        // 教科ごとに集計
        const aggregatedRecords = dayRecords.reduce((acc: StudyRecord[], current) => {
          const existingIndex = acc.findIndex((item) => item.subject === current.subject);
          
          if (existingIndex > -1) {
            // すでに同じ教科がある場合、新しいオブジェクトを作って時間を足す
            acc[existingIndex] = {
              ...acc[existingIndex],
             duration: acc[existingIndex].duration + current.duration
            };
          } else {
            // 新しい教科の場合、コピーを追加
            acc.push({ ...current });
          }
          return acc;
        }, []);

        return (
          <li key={dateStr} className={styles.dayRow}>
            {/* 左側：日付（1つだけ表示） */}
            <div className={styles.dateSide}>{dateStr}</div>

            {/* 右側：その日の勉強内容リスト */}
            <div className={styles.recordsContainer}>
              {aggregatedRecords.length > 0 ? (
                aggregatedRecords.map((record) => (
                  <div key={record.id} className={styles.itemWrapper}>
                    <StudyItem
                      record={record}
                      onDelete={onDelete}
                      onUpdate={onUpdate}
                    />
                  </div>
                ))
              ) : (
                <div className={styles.noStudyText}>勉強していません</div>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default StudyList;