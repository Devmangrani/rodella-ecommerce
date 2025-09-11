import { useState, useEffect, Fragment } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonIcon from '@mui/icons-material/Person';
import logo from "/assets/logo.jpg"
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useCart } from '../context/myState';

// NavBrand Component
const NavBrand = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <motion.div 
      className="flex items-center gap-x-2 sm:gap-x-3 md:gap-x-4 relative"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <a 
        href="https://rodella.in/" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="flex flex-col group focus:outline-none transition-all duration-300 hover:scale-105"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <motion.div
          className="flex flex-col leading-tight"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white font-bold tracking-wide group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
            rodella
          </span>
          <span className="text-[8px] sm:text-[9px] md:text-[10px] lg:text-[11px] text-gray-500 font-medium tracking-[0.2em] uppercase group-hover:text-gray-300 transition-all duration-300 -mt-1">
            AEROSPACE LABS
          </span>
        </motion.div>
        {hover && (
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            className="h-0.5 bg-gradient-to-r from-white to-gray-300 origin-left"
          />
        )}
      </a>
    </motion.div>
  );
};

// Form Component
const Form = () => {
  const [searchInput, setSearchInput] = useState('');
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    navigate('/search');
  };

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <motion.form
      onSubmit={handleFormSubmit}
      className={`flex justify-center items-center relative mx-auto self-center ${
        windowWidth <= 480 ? 'w-[160px]' : 
        windowWidth <= 600 ? 'w-[200px]' : 
        windowWidth <= 768 ? 'w-[250px]' : 
        windowWidth <= 1024 ? 'w-[300px]' : 
        'w-full'
      }`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <motion.input
        type="text"
        placeholder={windowWidth <= 480 ? "Search..." : "Search for products"}
        value={searchInput}
        onChange={handleChange}
        required
        className="w-full h-[36px] sm:h-[40px] md:h-[42px] lg:h-[45px] outline-none pl-4 sm:pl-5 md:pl-6 pr-12 text-xs sm:text-sm md:text-base border border-neutral-700 rounded-xl sm:rounded-2xl bg-neutral-900/50 text-white placeholder-neutral-500 transition-all duration-300 focus:shadow-[0_0_0_2px_rgba(255,255,255,0.1)] focus:border-neutral-600"
        whileFocus={{ scale: 1.02 }}
      />
      <motion.button
        type="submit"
        className="absolute h-[36px] sm:h-[40px] md:h-[42px] lg:h-[45px] w-[40px] sm:w-[45px] md:w-[48px] lg:w-[50px] bg-neutral-800 text-white right-0 font-bold border border-neutral-700 rounded-r-xl sm:rounded-r-2xl flex justify-center items-center cursor-pointer transition-all duration-300 hover:bg-neutral-700"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <SearchIcon fontSize={windowWidth <= 480 ? "small" : windowWidth <= 768 ? "medium" : "medium"} />
      </motion.button>
    </motion.form>
  );
};

// Control Component
const Control = ({ isLoggedIn, setIsLoggedIn }) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const navigate = useNavigate();
  const location = useLocation();
  const { getCartTotals } = useCart();
  const { totalItems } = getCartTotals();

  const isCartPage = location.pathname === '/cart';
  const isDashboardPage = location.pathname === '/dashboard' || location.pathname === '/login';

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleAuthClick = () => {
    if (isLoggedIn) {
      // Navigate to dashboard
      navigate('/dashboard');
    } else {
      // Navigate to login
      navigate('/login');
    }
  };

  const handleCartClick = () => {
    if (isLoggedIn) {
      // Navigate to cart
      navigate('/cart');
    } else {
      // Store redirect flag and navigate to login
      localStorage.setItem('redirectToCartAfterLogin', 'true');
      navigate('/login');
    }
  };

  const handleLogout = () => {
    // Clear ALL localStorage data
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('rodella_cart');
    localStorage.removeItem('redirectToCartAfterLogin');
    
    // Update state immediately
    setIsLoggedIn(false);
    
    // Dispatch custom event to notify other components of auth state change
    window.dispatchEvent(new Event('authStateChanged'));
    
    // Force navigation to home page
    navigate('/', { replace: true });
  };

  return (
    <motion.div 
      className="flex items-center gap-x-2 sm:gap-x-3 md:gap-x-4 xl:gap-x-5"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      {windowWidth > 1024 && (
        <>
          <motion.div 
            className={`relative w-[40px] h-[40px] md:w-[45px] md:h-[45px] flex justify-center items-center border rounded-2xl cursor-pointer text-white transition-all duration-300 hover:bg-gray-800/50 hover:border-gray-500 ${
              isCartPage 
                ? 'border-white bg-gray-800/30' 
                : 'border-gray-700'
            }`}
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCartClick}
          >
            <ShoppingCartIcon className="text-white text-[20px] md:text-[24px]" />
            {totalItems > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 bg-gray-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
              >
                {totalItems > 99 ? '99+' : totalItems}
              </motion.span>
            )}
          </motion.div>
          <motion.div 
            className={`w-[40px] h-[40px] md:w-[45px] md:h-[45px] flex justify-center items-center border rounded-2xl cursor-pointer text-white transition-all duration-300 hover:bg-gray-800/50 hover:border-gray-500 ${
              isDashboardPage 
                ? 'border-white bg-gray-800/30' 
                : 'border-gray-700'
            }`}
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAuthClick}
          >
            <PersonIcon className="text-white text-[20px] md:text-[24px]" />
          </motion.div>
        </>
      )}
      {/* Only show Contact Us button on larger screens (when drawer is not used) */}
      {windowWidth > 1024 && (
        <Link to="/contact" className="focus:outline-none">
          <motion.div 
            className={`bg-white text-black shadow-lg rounded-2xl flex items-center hover:bg-gray-100 transition-all duration-300 focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-black font-medium whitespace-nowrap ${
              windowWidth >= 1400 ? 'px-5 py-2.5 text-base' :
              windowWidth >= 1280 ? 'px-3 py-2 text-sm' :
              'px-2 py-1.5 text-xs'
            }`}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            Contact Us
          </motion.div>
        </Link>
      )}
    </motion.div>
  );
};

// DrawerNav Component
const DrawerNav = ({ isLoggedIn }) => {
  const [state, setState] = useState({
    left: false,
  });
  const navigate = useNavigate();
  const { getCartTotals } = useCart();
  const { totalItems } = getCartTotals();

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setState({ ...state, [anchor]: open });
  };

  const handleDrawerCartClick = () => {
    if (isLoggedIn) {
      // Navigate to cart
      navigate('/cart');
    } else {
      // Store redirect flag and navigate to login
      localStorage.setItem('redirectToCartAfterLogin', 'true');
      navigate('/login');
    }
    // Close drawer
    setState({ left: false });
  };

  const menuItems = [
    { path: "/", label: "Home" },
    { path: "/Composite-tubes", label: "Composite Tubes" },
    { path: "/composite-plates", label: "Composite Plates" },
    { path: "/reinforcement", label: "Reinforcement" },
    { path: "/core-material", label: "Core Material" },
    { path: "/epoxy-system", label: "Epoxy System" },
  ];

  const list = (anchor) => (
    <Box
      className="w-[280px] sm:w-[320px] md:w-[360px] bg-black h-full text-white"
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <div className="p-4 sm:p-6 md:p-8">
        <div className="search__drawer mb-4 sm:mb-6">
          
        </div>
      </div>
      <Divider className="bg-gray-800" />
      <List className="px-3 sm:px-4 md:px-6">
        {menuItems.map((item, index) => (
          <motion.div
            key={item.path}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <ListItem disablePadding className="my-2">
              <ListItemButton
                component={Link}
                to={item.path}
                className="rounded-xl hover:bg-gray-800/50 transition-all duration-300 py-3 md:py-4"
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  },
                }}
              >
                <ListItemText>
                  <motion.span
                    className="text-white hover:text-gray-200 transition-colors duration-300 text-sm sm:text-base md:text-lg"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    {item.label}
                  </motion.span>
                </ListItemText>
              </ListItemButton>
            </ListItem>
          </motion.div>
        ))}
      </List>
      <Divider className="bg-gray-800 my-4 md:my-6" />
      <motion.div 
        className="flex justify-center items-center gap-6 sm:gap-8 md:gap-10 py-6 sm:py-8 md:py-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          className="group cursor-pointer"
          onClick={handleDrawerCartClick}
        >
          <div className="flex flex-col items-center gap-2">
            <div className="relative w-[50px] h-[50px] sm:w-[60px] sm:h-[60px] md:w-[70px] md:h-[70px] border-2 border-gray-700 rounded-2xl hover:bg-gray-800/50 transition-all duration-300 group-hover:border-gray-500 flex items-center justify-center">
              <ShoppingCartIcon className="text-white w-[24px] h-[24px] sm:w-[30px] sm:h-[30px] md:w-[35px] md:h-[35px]" />
              {totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-gray-600 text-white text-xs font-bold rounded-full h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 flex items-center justify-center"
                >
                  {totalItems > 99 ? '99+' : totalItems}
                </motion.span>
              )}
            </div>
            <span className="text-gray-400 text-xs sm:text-sm md:text-base group-hover:text-white transition-colors duration-300">
              Cart {totalItems > 0 && `(${totalItems})`}
            </span>
          </div>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          className="group"
        >
          <Link to={isLoggedIn ? "/dashboard" : "/login"} className="no-underline">
            <div className="flex flex-col items-center gap-2">
              <div className="w-[50px] h-[50px] sm:w-[60px] sm:h-[60px] md:w-[70px] md:h-[70px] border-2 border-gray-700 rounded-2xl hover:bg-gray-800/50 transition-all duration-300 group-hover:border-gray-500 flex items-center justify-center">
                <PersonIcon className="text-white w-[24px] h-[24px] sm:w-[30px] sm:h-[30px] md:w-[35px] md:h-[35px]" />
              </div>
              <span className="text-gray-400 text-xs sm:text-sm md:text-base group-hover:text-white transition-colors duration-300">
                {isLoggedIn ? "Dashboard" : "Account"}
              </span>
            </div>
          </Link>
        </motion.div>
      </motion.div>
      <motion.div 
        className="px-4 sm:px-6 md:px-8 py-4 md:py-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        <Link to="/contact" className="no-underline">
          <motion.div 
            className="bg-white text-black px-4 md:px-6 py-2.5 sm:py-3 md:py-4 shadow-lg rounded-2xl flex items-center justify-center hover:bg-gray-100 transition-all duration-300 text-sm sm:text-base md:text-lg font-medium"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            Contact Us
          </motion.div>
        </Link>
      </motion.div>
    </Box>
  );

  return (
    <Fragment>
      {['left'].map((anchor) => (
        <Fragment key={anchor}>
          <motion.div 
            className="cursor-pointer"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            {state.left ? (
              <MenuOpenIcon 
                fontSize='large' 
                className="text-white hover:text-neutral-300 transition-colors duration-300"
                onClick={toggleDrawer(anchor, false)}
              />
            ) : (
              <MenuIcon 
                fontSize='large' 
                className="text-white hover:text-neutral-300 transition-colors duration-300"
                onClick={toggleDrawer(anchor, true)} 
              />
            )}
          </motion.div>
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
            className="z-[1001]"
            PaperProps={{
              sx: {
                backgroundColor: 'rgb(0, 0, 0)',
                backdropFilter: 'blur(10px)',
              }
            }}
          >
            {list(anchor)}
          </Drawer>
        </Fragment>
      ))}
    </Fragment>
  );
};

// NavLinks Component
const NavLinks = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (windowWidth <= 1024) {
    return null;
  }

  return (
    <motion.ul 
      className={`xl:flex items-center hidden ${
        windowWidth >= 1400 ? 'gap-x-2' :
        windowWidth >= 1280 ? 'gap-x-1' :
        windowWidth >= 1024 ? 'gap-x-0.5' :
        'gap-x-1'
      }`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      {[
        { path: "/", label: "Home" },
        { path: "/Composite-tubes", label: "Composite Tubes" },
        { path: "/composite-plates", label: "Composite Plates" },
        { path: "/reinforcement", label: "Reinforcement" },
        { path: "/core-material", label: "Core Material" },
        { path: "/epoxy-system", label: "Epoxy System" },
      ].map((item, index) => (
        <motion.li
          key={index}
          className="group/link"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Link
            to={item.path}
            className={`flex items-center gap-1 hover:bg-white/5 cursor-pointer py-2 rounded-2xl text-white hover:text-white transition-all duration-300 whitespace-nowrap ${
              windowWidth >= 1400 ? 'px-4 text-base' :
              windowWidth >= 1280 ? 'px-2 text-sm' :
              windowWidth >= 1024 ? 'px-1.5 text-xs' :
              'px-2 text-sm'
            }`}
          >
            <motion.span
              whileHover={{ scale: 1.05, x: 2 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              {item.label}
            </motion.span>
          </Link>
        </motion.li>
      ))}
    </motion.ul>
  );
};

// Main Header Component
const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Scroll detection logic
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show navbar when at the top of the page
      if (currentScrollY < 10) {
        setIsNavbarVisible(true);
      } 
      // Hide navbar when scrolling down, show when scrolling up
      else if (currentScrollY > lastScrollY) {
        // Scrolling down
        setIsNavbarVisible(false);
      } else {
        // Scrolling up
        setIsNavbarVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    // Throttle scroll events for better performance
    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledHandleScroll);
    
    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
    };
  }, [lastScrollY]);

  // Check authentication status
  useEffect(() => {
    const checkAuthStatus = () => {
      const authToken = localStorage.getItem('authToken');
      const userData = localStorage.getItem('userData');
      
      // Both must exist for user to be considered authenticated
      const isAuthenticated = !!(authToken && userData);
      setIsLoggedIn(isAuthenticated);
      
      // Clean up stale data if not properly authenticated
      if (!isAuthenticated) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        localStorage.removeItem('rodella_cart');
      }
    };
    
    // Initial check
    checkAuthStatus();

    // Listen for storage changes to update auth state
    const handleStorageChange = (e) => {
      if (e.key === 'authToken') {
        checkAuthStatus();
      }
    };
    
    // Listen for custom events when localStorage is updated from the same tab
    const handleAuthChange = () => {
      checkAuthStatus();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('authStateChanged', handleAuthChange);
    
    // Also check periodically in case localStorage changes without event
    const interval = setInterval(checkAuthStatus, 1000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authStateChanged', handleAuthChange);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className={`fixed top-0 left-0 right-0 z-[9999] px-2 sm:px-4 md:px-6 pt-2 sm:pt-4 transition-transform duration-300 ease-in-out ${
      isNavbarVisible ? 'translate-y-0' : '-translate-y-full'
    }`}>
      <motion.nav 
        className="py-2 sm:py-3 md:py-4 flex items-center justify-between bg-black/95 backdrop-blur-md text-white rounded-xl sm:rounded-2xl px-3 sm:px-4 md:px-6 lg:px-4 xl:px-8 w-full max-w-[1536px] mx-auto shadow-2xl border border-gray-800/50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      >
        <NavBrand />
        <NavLinks />
        <div className="flex items-center gap-x-2 sm:gap-x-3 md:gap-x-4 lg:gap-x-3 xl:gap-x-5">
          <Control isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
          <div className="xl:hidden">
            <DrawerNav isLoggedIn={isLoggedIn} />
          </div>
        </div>
      </motion.nav>
    </div>
  );
};

export default Header;
