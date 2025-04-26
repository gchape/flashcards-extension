import styles from "./css/Header.module.css";

interface HeaderProps {
  day: number;
}

export default function Header({ day }: HeaderProps) {
  return (
    <div className={styles["header"]}>
      <h1>Flashcards</h1>
      <p>Day: {day}</p>
    </div>
  );
}
