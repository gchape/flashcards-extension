import { ComponentPropsWithoutRef } from "react";
import styles from "./css/Footer.module.css";

interface FooterProps extends ComponentPropsWithoutRef<"footer"> {}
// The footer component is used to display the voting options for the flashcards
export default function Footer({ children }: FooterProps) {
  return (
    <footer className={styles.footer}>
      <h2 className={styles["footer-title"]}>How hard was this card?</h2>
      <h3 className={styles["footer-subtitle"]}>Use hand gesture to vote:</h3>
      <ul className={styles["footer-list"]}>
        <li>👍 Thumbs up = Easy</li>
        <li>👎 Thumbs down = Wrong</li>
        <li>✋ Raised hand = Hard</li>
      </ul>
      <div className={styles["footer-buttons"]}>{children}</div>
    </footer>
  );
}
