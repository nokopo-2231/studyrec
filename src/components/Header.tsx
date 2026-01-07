import logo from "../assets/images/Logo.png";
import button from "../assets/images/button.png";
import styles from "./Header.module.css";
import formStyles from './StudyForm.module.css'

type Props = {
  open: boolean
  onToggle: () => void
  onSubmit: () => void
}

const Header = ({ open, onToggle, onSubmit }: Props) => {
  return (
    // 外枠の header タグは App.tsx にあるので、ここでは inner だけ指定
    <div className={styles.container}>
      <div className={styles.inner}>
          <h1 className={styles.logo}>
            <a href="#">
              <img src={logo} alt="logo" />
            </a>
          </h1>

          {open ? (
          <button
            className={formStyles.submitButton}
            onClick={onSubmit}
          >
            追加
          </button>
        ) : (
          <button
            className={styles.toggleBtn}
            onClick={onToggle}
          >
            <img src={button} alt="plus" />
          </button>
        )}
      </div>
    </div>
  )
}

export default Header
