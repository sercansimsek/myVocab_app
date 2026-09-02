import { Outlet } from "react-router-dom";

export const Layout = () => {
  return (
    <>
      <header>myVocab</header>

      <main>
        <Outlet />
      </main>
    </>
  );
};
