import { useState } from 'react'

interface AICommentProps {
  records: any[]; // 実際の型に合わせて調整してください
}

const AIComment = ({ records }: AICommentProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // 学習状況に応じたメッセージ生成ロジック（例）
  const getMessage = () => {
    if (records.length === 0) return "まずは今日の最初の1歩を記録してみよう！応援してるよ。";
    if (records.length > 5) return "すごい！今週はかなり積み上げられてるね。その調子！";
    return "お疲れ様！一歩ずつの積み重ねが、大きな成果になるよ。頑張って！";
  };

  return (
    <div className="ai-comment-section">
      <div className="ai-icon-wrapper" onClick={() => setIsOpen(!isOpen)}>
        <img className="ai-icon" src="/robot.png" alt="AI Comment Icon" ></img>
      </div>

      {isOpen && (
        <div className="ai-popover">
          <p>{getMessage()}</p>
        </div>
      )}
    </div>
  );
};

export default AIComment;