import { ComponentPropsWithoutRef } from "react";
import styles from "./css/Button.module.css";

interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
  text: string;
  className:
    | "go-to-next-day"
    | "save"
    | "clear"
    | "get-hint"
    | "show-answer"
    | "easy"
    | "hard"
    | "wrong";
}

export default function Button({ text, className, ...props }: ButtonProps) {
  return (
    <button className={styles[`button--${className}`]} {...props}>
      {text}
    </button>
  );
}
