import StudyItem from './StudyItem'
import type { StudyRecord } from '../types/study'
import styles from './StudyList.module.css'

type Props = {
  records: StudyRecord[]
  onDelete: (id: string) => void
  onUpdate: (record: StudyRecord) => void
}

const StudyList = ({ records, onDelete, onUpdate }: Props) => {
  // 1. 今週の月曜日から日曜日までの日付文字列（YYYY-MM-DD）の配列を生成する
  const getWeekDatesArray = () => {
    const now = new Date();
    const day = now.getDay();
    // 月曜日を週の始まりとする計算
    const diffToMon = day === 0 ? -6 : 1 - day;
    const monday = new Date(now);
    monday.setDate(now.getDate() + diffToMon);

    return [...Array(7)].map((_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    });
  };

  const weekDates = getWeekDatesArray();

  return (
    <ul className={styles.list}>
      {weekDates.map((dateStr) => {
        // その日のレコードだけを抽出
        const dayRecords = records.filter((r) => r.date === dateStr);

        // 教科ごとに秒数を集計
        const aggregatedRecords = dayRecords.reduce((acc: StudyRecord[], current) => {
          const existingIndex = acc.findIndex((item) => item.subject === current.subject);
          
          if (existingIndex > -1) {
            acc[existingIndex] = {
              ...acc[existingIndex],
              // 秒数を単純加算
              duration: acc[existingIndex].duration + current.duration
            };
          } else {
            // 参照を切るためにスプレッドでコピー
            acc.push({ ...current });
          }
          return acc;
        }, []);

        return (
          <li key={dateStr} className={styles.dayRow}>
            {/* 左側：日付表示 */}
            <div className={styles.dateSide}>{dateStr}</div>

            {/* 右側：その日の学習記録リスト */}
            <div className={styles.recordsContainer}>
              {aggregatedRecords.length > 0 ? (
                aggregatedRecords.map((record) => (
                  <div key={`${dateStr}-${record.subject}`} className={styles.itemWrapper}>
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