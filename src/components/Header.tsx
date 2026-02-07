import logo from "../assets/images/Logo.png";
import button from "../assets/images/button.png";
import styles from "./Header.module.css";

type Props = {
  open: boolean
  onToggle: () => void
  onSubmit: () => void
}

const Header = ({ open, onToggle }: Props) => {
  return (
    // 外枠の header タグは App.tsx にあるので、ここでは inner だけ指定
    <div className={styles.container}>
      <div className={styles.inner}>
          <h1 className={styles.logo}>
            <a href="#">
              <img src={logo} alt="logo" />
            </a>
          </h1>

          <button
            className={`${styles.toggleBtn} ${open ? styles.open : ''}`}
            onClick={onToggle}
          >
            <img src={button} alt="plus" />
          </button>
      </div>
    </div>
  )
}

export default Header
