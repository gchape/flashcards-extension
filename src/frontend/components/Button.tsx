import { ComponentPropsWithoutRef } from "react";
import styles from "./Button.module.css";

interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
  text: string;
  className?: string;
}

export default function Button({ text, className, ...props }: ButtonProps) {
  return (
    <button className={className} style={styles} {...props}>
      {text}
    </button>
  );
}
