import StudyItem from './StudyItem'
import type { StudyRecord } from '../types/study'
import styles from './StudyList.module.css'

type Props = {
  records: StudyRecord[]
  onDelete: (id: string) => void
  onUpdate: (record: StudyRecord) => void
}


const StudyList = ({ records, onDelete, onUpdate }: Props) => {
  if (records.length === 0) {
    return <p>まだ勉強していません</p>
  }

  return (
    <ul className={styles.list}>
      {records.map((record) => (
        <StudyItem 
        key={record.id} record={record} onDelete={onDelete} onUpdate={onUpdate} 
        />
      ))}
    </ul>
  )
}

export default StudyList
