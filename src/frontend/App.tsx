import { useState } from "react";
import FlashcardsContextProvider from "../backend/store/flashcards-context";
import Button from "./components/Button";
import Main from "./components/Main";
import Header from "./components/Header";

function App() {
  const [day, setDay] = useState(0);

  return (
    <FlashcardsContextProvider>
      <Main>
        <Header day={day} />
        <Button className="go-to-next-day" text="Go to Next Day" />
      </Main>
    </FlashcardsContextProvider>
  );
}

export default App;
