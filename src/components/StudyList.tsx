import StudyItem from './StudyItem'
import type { StudyRecord } from '../types/study'
import styles from './StudyList.module.css'

type Props = {
  records: StudyRecord[]
  targetDate: Date; // ★ 追加：親(App.tsx)から受け取る表示基準日
  onDelete: (id: string) => void
  onUpdate: (record: StudyRecord) => void
}

const StudyList = ({ records, targetDate, onDelete, onUpdate }: Props) => {
  
  // 1. 引数 baseDate を基準に1週間分の日付を生成するように変更
  const getWeekDatesArray = (baseDate: Date) => {
    const day = baseDate.getDay();
    // 月曜日を週の始まりとする計算
    const diffToMon = day === 0 ? -6 : 1 - day;
    const monday = new Date(baseDate); // ★ now ではなく baseDate を使う
    monday.setDate(baseDate.getDate() + diffToMon);

    return [...Array(7)].map((_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const date = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${date}`;
    });
  };

  // targetDate を渡して日付配列を取得
  const weekDates = getWeekDatesArray(targetDate);

  // ★ クリックされた日を特定するための文字列 (YYYY-MM-DD)
  const selectedDateStr = `${targetDate.getFullYear()}-${String(targetDate.getMonth() + 1).padStart(2, '0')}-${String(targetDate.getDate()).padStart(2, '0')}`;

  return (
    <ul className={styles.list}>
      {weekDates.map((dateStr) => {
        // その日のレコードだけを抽出
        const dayRecords = records.filter((r) => r.date === dateStr);

        // ★ その日が「カレンダーでクリックされた日」かどうか
        const isSelected = dateStr === selectedDateStr;

        // 教科ごとに秒数を集計 (既存ロジック)
        const aggregatedRecords = dayRecords.reduce((acc: StudyRecord[], current) => {
          const existingIndex = acc.findIndex((item) => item.subject === current.subject);
          if (existingIndex > -1) {
            acc[existingIndex] = {
              ...acc[existingIndex],
              duration: acc[existingIndex].duration + current.duration
            };
          } else {
            acc.push({ ...current });
          }
          return acc;
        }, []);

        return (
          // ★ isSelected が true なら専用の CSS クラス（highlightなど）を当てる
          <li key={dateStr} className={`${styles.dayRow} ${isSelected ? styles.highlight : ''}`}>
            <div className={styles.dateSide}>{dateStr}</div>

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