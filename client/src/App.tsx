import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { NewWordPage } from "./pages/NewWordPage";
import { PracticePage } from "./pages/PracticePage";
import { NotFoundPage } from "./pages/NotFoundPage";

export const App = () => {
  return (
    <Routes>
      <Route element={<Layout />}></Route>
      <Route path="/" element={<Layout />}></Route>
      <Route path="/login" element={<LoginPage />}></Route>
      <Route path="/register" element={<RegisterPage />}></Route>
      <Route path="/words/new" element={<NewWordPage />}></Route>
      <Route path="/practice" element={<PracticePage />}></Route>
      <Route path="*" element={<NotFoundPage />}></Route>
    </Routes>
  );
};
