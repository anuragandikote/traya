import Header from "../../components/Header";
import Stepnavigator from "../../components/Stepnavigator";
import StepLocation from "../../components/StepLocation";
import ProgressBar from "../../components/ProgressBar";
import Questions from "../../components/Questions";

export default function Home() {
  return (
    <div className="items-center justify-items-center min-h-screen bg-white">
      <Header />
      <Stepnavigator />
      <StepLocation />
      <ProgressBar />
      <Questions />
    </div>
  );
}
