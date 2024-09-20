import SmallHeader from "../components/SmallHeader";
import SignupForm from "../components/SignupForm";
export default function Signup() {
  return (
    <>
      <SmallHeader />
      <div className="flex-row justify-center ">
        <SignupForm />
      </div>
    </>
  );
}
