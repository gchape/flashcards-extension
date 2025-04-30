import { ComponentPropsWithoutRef } from "react";
import styles from "./css/Main.module.css";

interface MainProps extends ComponentPropsWithoutRef<"main"> {}
// This is used to run
export default function Main({ children, ...props }: MainProps) {
  return (
    <main style={styles} {...props}>
      {children}
    </main>
  );
}
