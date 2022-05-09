import Link from "next/link";
import { useRouter } from "next/router";
import styles from "./Toolbar.module.css";

const Toolbar = () => {
  const router = useRouter();
  const activeLink = (
    path,
    content,
    activeClass = styles.active,
    normalClass = ""
  ) => {
    let className = router.pathname === path ? activeClass : normalClass;
    return (
      <Link href={path}>
        <a className={className}>{content}</a>
      </Link>
    );
  };

  return (
    <div className={styles.toolbar}>
      <nav>
        {activeLink("/", "Home")}
        {activeLink("/about", "About")}
      </nav>
    </div>
  );
};

export default Toolbar;
