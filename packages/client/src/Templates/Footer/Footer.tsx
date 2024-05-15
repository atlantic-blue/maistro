import React from "react"

import * as styles from "./Footer.scss"

const Footer: React.FC = () => {
    return (
        <footer className={styles.footer}>
            <nav className={styles.footerNavigation}>
                <ul className={styles.footerNavigationList}>
                    {/* // TODO aria labels */}
                    <li className={styles.footerNavigationItem}><a href="#privacy">Privacy Policy</a></li>
                    <li className={styles.footerNavigationItem}><a href="#terms">Terms of Use</a></li>
                    <li className={styles.footerNavigationItem}><a href="#contact">Contact Us</a></li>
                </ul>
            </nav>
            <div className={styles.footerInfo}>
                © {new Date().getFullYear()} Your Company. All rights reserved.
            </div>
        </footer>
    )
}

export default Footer