import React from "react";
import styles from "./Footer.module.css"

function Footer() {
    return(
      <footer className={styles.footer}>
        <p><span className="bold">Get a Pet</span> &copy; 2022</p>
      </footer>
    );    
}

export default Footer;