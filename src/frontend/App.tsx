import FlashcardsContextProvider from "../backend/store/flashcards-context";
import Button from "./components/Button";

function App() {
  return (
    <FlashcardsContextProvider>
      <Button text="Add" backgroundColor="blue"></Button>
    </FlashcardsContextProvider>
  );
}

export default App;
