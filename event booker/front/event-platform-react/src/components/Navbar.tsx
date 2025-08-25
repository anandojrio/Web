import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../styles/Navbar.module.css";
import { useAuth } from "../context/AuthContext";
import { getCategories } from "../api/categories";

const Navbar: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [catLoading, setCatLoading] = useState(true);
  const [catError, setCatError] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [search, setSearch] = useState("");

  // DEBUG: Render log
  // console.log("RENDERING NAVBAR", user, loading);

  // Fetch categories only for guests (public navbar)
  React.useEffect(() => {
    if (!user && !loading) {
      setCatLoading(true);
      getCategories()
        .then(res => setCategories(res.data.data || []))
        .catch(() => setCatError("Greška pri učitavanju kategorija"))
        .finally(() => setCatLoading(false));
    }
  }, [user, loading]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.querySelector("input");
    const value = input ? (input as HTMLInputElement).value : search;
    if (value.trim()) {
      navigate(`/search?q=${encodeURIComponent(value)}`);
      setSearch("");
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
      window.location.href = "/";
    } catch {
      alert("Greška pri odjavi.");
    }
  };

  if (loading) return null;

  // ---- ADMIN NAVBAR ----
  if (user?.role === "admin") {
    return (
      <div className={styles.navbarStacked}>
        <div className={styles.navTitleBar}>
          <span className={styles.mainTitle}>Event Booker</span>
          <span className={styles.subTitle}>Vaša platforma za događaje</span>
        </div>
        <nav className={styles.navbarRow}>
          <div className={styles.navLeft}>
            <Link to="/kategorije" className={styles.navLink}>Kategorije</Link>
            <Link to="/events" className={styles.navLink}>Događaji</Link>
            <Link to="/korisnici" className={styles.navLink}>Korisnici</Link>
            <form className={styles.searchForm} onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="search"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className={styles.searchInput}
                maxLength={40}
              />
            </form>
          </div>
          <div className={styles.navRight}>
            <span className={styles.navUsername} style={{ marginRight: 10 }}>
              {user.firstName} {user.lastName}
            </span>
            <button className={styles.navLink} style={{ cursor: "pointer" }} onClick={handleLogout}>
              Odjava
            </button>
          </div>
        </nav>
      </div>
    );
  }

  // ---- EVENT CREATOR NAVBAR ----
  if (user?.role === "event_creator" || user?.role === "event creator") {
    return (
      <div className={styles.navbarStacked}>
        <div className={styles.navTitleBar}>
          <span className={styles.mainTitle}>Event Booker</span>
          <span className={styles.subTitle}>Vaša platforma za događaje</span>
        </div>
        <nav className={styles.navbarRow}>
          <div className={styles.navLeft}>
            <Link to="/kategorije" className={styles.navLink}>Kategorije</Link>
            <Link to="/events" className={styles.navLink}>Događaji</Link>
            <form className={styles.searchForm} onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="search"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className={styles.searchInput}
                maxLength={40}
              />
            </form>
          </div>
          <div className={styles.navRight}>
            <span className={styles.navUsername} style={{ marginRight: 10 }}>
              {user.firstName} {user.lastName}
            </span>
            <button className={styles.navLink} style={{ cursor: "pointer" }} onClick={handleLogout}>
              Odjava
            </button>
          </div>
        </nav>
      </div>
    );
  }

  // ---- GUEST NAVBAR ----
  return (
    <div className={styles.navbarStacked}>
      <div className={styles.navTitleBar}>
        <span className={styles.mainTitle}>Event Booker</span>
        <span className={styles.subTitle}>Vaša platforma za događaje</span>
      </div>
      <nav className={styles.navbarRow}>
        <div className={styles.navLeft}>
          <Link to="/" className={styles.navLink}>Početna</Link>
          <Link to="/najposeceniji" className={styles.navLink}>Najposećeniji</Link>
          <div
            className={styles.dropdown}
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
          >
            <span className={styles.navLink} style={{ cursor: "pointer" }}>
              Kategorije<span className={styles.dropdownArrow}>▾</span>
            </span>
            {showDropdown && (
              <div className={styles.dropdownContent}>
                {catLoading && <div className={styles.dropdownItem}>Učitavanje...</div>}
                {catError && <div className={styles.dropdownItem}>{catError}</div>}
                {categories.map(cat =>
                  <Link
                    key={cat.id}
                    to={`/kategorije/${cat.id}`}
                    className={styles.dropdownItem}
                  >
                    {cat.name}
                  </Link>
                )}
                {!catLoading && !catError && categories.length === 0 &&
                  <div className={styles.dropdownItem}>Nema kategorija</div>
                }
              </div>
            )}
          </div>
          <form className={styles.searchForm} onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className={styles.searchInput}
              maxLength={40}
            />
          </form>
        </div>
        <div className={styles.navRight}>
          <Link to="/login" className={styles.navLink}>Prijava</Link>
          <Link to="/register" className={styles.navLink}>Registracija</Link>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
