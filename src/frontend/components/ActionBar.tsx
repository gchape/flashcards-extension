import Button from "./Button";
import Footer from "./Footer";

type ActionBarProps = {
  showAnswer: boolean;
  currentCardsCount: number;
  setDay: React.Dispatch<React.SetStateAction<number>>;
  setShowAnswer: React.Dispatch<React.SetStateAction<boolean>>;
};

export function ActionBar({
  setDay,
  showAnswer,
  setShowAnswer,
  currentCardsCount,
}: ActionBarProps) {
  return currentCardsCount === 0 ? (
    <Button
      className="go-to-next-day"
      text="Go to Next Day"
      onClick={() => setDay((prev) => prev + 1)}
    />
  ) : showAnswer ? (
    <Footer>
      <Button className="wrong" text="Wrong" />
      <Button className="hard" text="Hard" />
      <Button className="easy" text="Easy" />
    </Footer>
  ) : (
    <div style={{ display: "flex", gap: "20px" }}>
      <Button className="get-hint" text="Get Hint" />
      <Button
        className="show-answer"
        text="Show Answer"
        onClick={() => setShowAnswer((prev) => !prev)}
      />
    </div>
  );
}
