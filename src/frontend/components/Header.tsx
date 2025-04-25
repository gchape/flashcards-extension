import styles from "./Header.module.css";

interface HeaderProps {
  day: number;
}

export default function Header({ day }: HeaderProps) {
  return (
    <div style={styles}>
      <h1>Flashcards</h1>
      <p>Day: {day}</p>
    </div>
  );
}
