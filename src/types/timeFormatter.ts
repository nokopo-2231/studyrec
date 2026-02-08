export const formatToHMS = (totalSeconds: number): string => {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${String(h).padStart(2, '0')} : ${String(m).padStart(2, '0')} : ${String(s).padStart(2, '0')}`;
};

// 統計表示用（秒を切り捨てて「○時間 ○分」とする場合）
export const formatToHM = (totalMinutes: number): string => {
  const h = Math.floor(totalMinutes / 60);
  const m = Math.floor(totalMinutes % 60);
  return `${h}時間 ${m}分`;
};