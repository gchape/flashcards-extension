import { ComponentPropsWithoutRef } from "react";
import styles from "./Button.module.css";

interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
  text: string;
  className: "go-to-next-day" | "save" | "clear" | "get-hint" | "show-answer";
}

export default function Button({ text, className, ...props }: ButtonProps) {
  return (
    <button
      className={styles[`button--${className}`]}
      style={styles}
      {...props}
    >
      {text}
    </button>
  );
}
