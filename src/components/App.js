import { Navigate, Route, Routes } from "react-router-dom";

import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Home from "../pages/Home";
import { useAuth } from "../hooks";
import Loader from "./Loader";

const Page404 = () => {
  return <h1>404 : Page not found!</h1>;
};

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate replace to="/login" />;
  }

  return children;
};

function App() {
  const { user, loading } = useAuth();
  console.log("auth in App", user);

  if (loading) {
    return <Loader />;
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="*" element={<Page404 />} />
    </Routes>
  );
}

export default App;
