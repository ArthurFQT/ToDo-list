import { Header } from "./components/Header/Header";
import styles from "./App.module.css"
import "./global.css"
import { List } from "./components/Lista/Lista";

export function App() {
  return(
    <>
      <Header />
      <div className={styles.warpper}>
          <main>
          <List />
          </main>
      </div>
    </>
  )
}