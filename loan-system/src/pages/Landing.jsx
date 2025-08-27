import { Link } from "react-router-dom";
import bg from "../assets/bg.jpeg";

export default function Landing() {
  return (
    <div
      className="h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${bg})`,
      }}
    >
      <div className="relative text-center text-white p-6">
        <h1 className="text-4xl font-bold mb-4">Online Loan System</h1>
        <p className="mb-6">Apply and manage your loans easily.</p>
        <div className="space-x-4">
          <Link
            to="/login"
            className="px-4 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-700"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="px-4 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-700"
          >
            Signup
          </Link>
        </div>
      </div>
    </div>
  );
}
