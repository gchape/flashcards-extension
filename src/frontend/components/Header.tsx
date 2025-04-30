import styles from "./css/Header.module.css";

interface HeaderProps {
  day: number;
}
// It displays the header of the app with the title and the current day
// The Header component is used to display the title and the current day of the flashcards
export default function Header({ day }: HeaderProps) {
  return (
    <div className={styles["header"]}>
      <h1>Flashcards</h1>
      <p>Day: {day}</p>
    </div>
  );
}
