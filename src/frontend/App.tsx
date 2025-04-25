import FlashcardsContextProvider from "../backend/store/flashcards-context";
import Button from "./components/Button";

function App() {
  return (
    <FlashcardsContextProvider>
      <Button className="go-to-next-day" text="Go to Next Day" />
      <Button className="clear" text="Clear" />
      <Button className="save" text="Save Card" />
      <Button className="get-hint" text="Save Card" />
      <Button className="show-answer" text="Save Card" />
    </FlashcardsContextProvider>
  );
}

export default App;
