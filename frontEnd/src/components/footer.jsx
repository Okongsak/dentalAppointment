import { useState, useEffect } from "react";
import { AiOutlineArrowUp } from "react-icons/ai";

const Footer = () => {
  const [BtnToTop, setBtnToTop] = useState(false);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 400) {
        setBtnToTop(true);
      } else {
        setBtnToTop(false);
      }
    });
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  return (
    <>
      <footer className="footer">
        <div className="footer-left">
          <span>
            Copyright © 2006 - {new Date().getFullYear()} Nakorn. All
            rights reserved.
          </span>
        </div>
      </footer>
      <div className="top-to-btm">
        {BtnToTop && (
          <AiOutlineArrowUp
            className="icon-position icon-style"
            onClick={scrollToTop}
          />
        )}
      </div>
    </>
  );
};

export default Footer;
