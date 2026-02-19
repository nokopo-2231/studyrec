
interface AICommentProps {
  message: string;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const AIComment = ({ message, isOpen, setIsOpen }: AICommentProps) => {
  return (
    <div className="ai-comment-section">
      {/* クリックで開閉を切り替え */}
      <div className="ai-icon-wrapper" onClick={() => setIsOpen(!isOpen)}>
        <img className="ai-icon" src="/robot.png" alt="AI Comment Icon" />
      </div>

      {isOpen && (
        <div className="ai-popover">
          {/* App.tsx でセットされた Gemini のメッセージを表示 */}
          <p>{message}</p>
          <div className="popover-arrow"></div>
        </div>
      )}
    </div>
  );
};

export default AIComment;