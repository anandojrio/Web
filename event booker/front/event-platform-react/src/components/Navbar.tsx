import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../styles/Navbar.module.css";
import { getCategories } from "../api/categories";

type Category = { id: number; name: string };

const Navbar: React.FC = () => {
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [catLoading, setCatLoading] = useState(true);
  const [catError, setCatError] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setCatLoading(true);
    getCategories()
      .then(res => setCategories(res.data.data || []))
      .catch(() => setCatError("Greška pri učitavanju kategorija"))
      .finally(() => setCatLoading(false));
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search)}`);
      setSearch("");
    }
  };

  return (
    <nav className={styles.navbar}>
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
      </div>
      <div className={styles.navTitle}>
        <span className={styles.mainTitle}>Event Booker</span>
        <span className={styles.subTitle}>Vaša platforma za događaje</span>
      </div>
      <div className={styles.navRight}>
        <form className={styles.searchForm} onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Pretraga događaja..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className={styles.searchInput}
          />
          <button className={styles.searchButton} type="submit">
            🔎
          </button>
        </form>
      </div>
    </nav>
  );
};

export default Navbar;
