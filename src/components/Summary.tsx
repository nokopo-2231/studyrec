type SummaryProps = {
  totalMinutes: number
}

const Summary = ({ totalMinutes }: SummaryProps) => {
  return (
    <section>
      <h2>合計学習時間</h2>
      <p>{totalMinutes} 分</p>
    </section>
  )
}

export default Summary
