import { Link, Outlet } from "react-router-dom";

export const Layout = () => {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-container header-content">
          <Link className="brand" to="/" aria-label="myVocab dashboard">
            <span className="brand-mark" aria-hidden="true">
              MV
            </span>
            <span>myVocab</span>
          </Link>
        </div>
      </header>

      <main className="app-container app-main">
        <Outlet />
      </main>
    </div>
  );
};
