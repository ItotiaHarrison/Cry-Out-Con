import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import logo from "../assets/cryoutcon.jpg";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLoading } from "./contexts/LoadingContext";

export const Navbar = () => {
  const { scrollY } = useScroll();
  const { setLoading } = useLoading();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();


  const headerHeight = useTransform(scrollY, [0, 100], ["4rem", "4rem"]);

  const backdropBlur = useTransform(
    scrollY,
    [0, 100],
    ["blur(0px)", "blur(8px)"]
  );

  const handleNavigation = (path: string, hash: string) => {
    setLoading(true);
    navigate(path);
    setTimeout(() => {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
      setLoading(false);
      setIsMobileMenuOpen(false);
    }, 100);
  };

  const borderOpacity = useTransform(scrollY, [0, 100], [0, 0.1]);

  const NavLink = ({
    to,
    children,
  }: {
    to: string;
    children: React.ReactNode;
  }) => {
    const gradient = "from-blue-400 via-purple-500 to-pink-500";
    const isActive = location.pathname === to;

    return (
      <div className="relative">
        <motion.div
          onClick={() => navigate(to)}
          className="text-white hover:cursor-pointer hover:text-gray-300 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {children}
        </motion.div>

        {isActive && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "100%", opacity: 1 }}
            transition={{
              duration: 1,
              delay: 0.2,
              type: "spring",
              stiffness: 50,
            }}
            className="relative h-1 mx-auto mt-2"
          >
            <motion.div
              className="absolute inset-0 blur-lg"
              style={{
                background: `linear-gradient(to right, #60a5fa, #db2777)`,
              }}
            />
            <motion.div
              className={`h-full bg-gradient-to-r ${gradient} rounded-full relative z-10`}
            />
          </motion.div>
        )}
      </div>
    );
  };

  const MobileMenu = () => (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className="md:hidden absolute top-full left-0 right-0 bg-primary p-4"
    >
      <div className="flex flex-col space-y-4">
      <a onClick={() => handleNavigation('/', '#conference')} className="hover:text-gray-200 transition-colors">Experiences</a>
          <NavLink to="/speakers">Speakers & Musical Guests</NavLink>
          <a onClick={() => handleNavigation('/', '#agenda')} className="hover:text-gray-200 transition-colors">Agenda</a>
          <NavLink to="/hotel-details" >Travel Info</NavLink>
        {/* <NavLink to="#">Sponsors</NavLink>
        <a href="#">Get App</a> */}

        <motion.a
          href="https://brushfire.com/tlhc/cryout25/578593"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setIsMobileMenuOpen(false);
          }}
          className="px-4 py-2 bg-white text-primary rounded font-semibold"
        >
          Register Now
        </motion.a>
      </div>
    </motion.div>
  );

  return (
    <motion.header
      style={{
        height: headerHeight,
        backdropFilter: backdropBlur,
        borderBottom: `1px solid rgba(255, 255, 255, ${borderOpacity.get()})`
      }}
      className="fixed top-0 left-0 right-0 bg-primary z-[9999] will-change-transform"
    >
      <nav className="flex items-center justify-between md:px-12 px-8 h-full ">
        <motion.div
          onClick={() => navigate("/")}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-shrink-0 hover:cursor-pointer"
        >
          <motion.img
            src={logo}
            alt="Cry Out Conference Logo"
            loading="lazy"
            className="md:w-auto md:max-h-[50px] w-40 object-contain"
            
          />
        </motion.div>

        <div className="hidden md:flex items-center justify-center text-xl  space-x-8">
          <a onClick={() => handleNavigation('/', '#conference')} className="hover:text-gray-200 transition-colors cursor-pointer">Experiences</a>
          <NavLink to="/speakers" >Speakers & Musical Guests</NavLink>
          <a onClick={() => handleNavigation('/', '#agenda')} className="hover:text-gray-200 transition-colors cursor-pointer">Agenda</a>
          <NavLink to="/hotel-details">Travel Info</NavLink>
          {/* <NavLink to="">Sponsors</NavLink> */}
        </div>

        <div className="hidden md:flex justify-end space-x-4 flex-shrink-0">
          <motion.a
            href="https://brushfire.com/tlhc/cryout25/578593"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="md:px-4 md:py-2 px-2 bg-white text-primary rounded font-semibold hover:bg-opacity-90 transition-all duration-200 shadow-lg hover:shadow-white/25"
          >
            Register Now
          </motion.a>
          <motion.a
            href="#"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 text-white border border-white/20 rounded font-semibold hover:bg-white hover:text-primary transition-all duration-200"
          >
            Get App
          </motion.a>
        </div>

        <button
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              d={
                isMobileMenuOpen
                  ? "M6 18L18 6M6 6l12 12"
                  : "M4 6h16M4 12h16M4 18h16"
              }
            ></path>
          </svg>
        </button>

        <AnimatePresence>{isMobileMenuOpen && <MobileMenu />}</AnimatePresence>
      </nav>
    </motion.header>
  );
};
