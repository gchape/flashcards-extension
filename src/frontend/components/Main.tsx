import { ComponentPropsWithoutRef } from "react";
import styles from "./Main.module.css";

interface MainProps extends ComponentPropsWithoutRef<"main"> {}

export default function Main({ children, ...props }: MainProps) {
  return (
    <main style={styles} {...props}>
      {children}
    </main>
  );
}
