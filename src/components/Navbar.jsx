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
      className="flex items-center gap-x-3 relative"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Link to="/" className="flex items-center group  focus:outline-none">
        {/* <img
          src={logo}
          alt="Rodella Logo"
          className="h-[40px] w-auto mr-2.5 object-contain transition-transform duration-300 group-hover:scale-110"
        /> */}
        <motion.h3 
          className="text-lg text-white font-medium tracking-wide group-hover:text-neutral-300 transition-colors duration-300"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          rodella
        </motion.h3>
      </Link>
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
        windowWidth <= 600 ? 'w-[200px]' : 'w-full'
      }`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <motion.input
        type="text"
        placeholder="Search for products"
        value={searchInput}
        onChange={handleChange}
        required
        className="w-full h-[45px] outline-none pl-6 text-sm border border-neutral-700 rounded-2xl bg-neutral-900/50 text-white placeholder-neutral-500 transition-all duration-300 focus:shadow-[0_0_0_2px_rgba(255,255,255,0.1)] focus:border-neutral-600"
        whileFocus={{ scale: 1.02 }}
      />
      <motion.button
        type="submit"
        className="absolute h-[45px] w-[50px] bg-neutral-800 text-white right-0 font-bold border border-neutral-700 rounded-r-2xl flex justify-center items-center cursor-pointer transition-all duration-300 hover:bg-neutral-700"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <SearchIcon fontSize="medium" />
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
      className="flex items-center gap-x-5"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      {windowWidth > 780 && (
        <>
          <motion.div 
            className={`relative w-[45px] h-[45px] flex justify-center items-center border rounded-2xl cursor-pointer text-white transition-all duration-300 hover:bg-neutral-800/50 hover:border-neutral-600 ${
              isCartPage 
                ? 'border-white bg-neutral-800/30' 
                : 'border-neutral-700'
            }`}
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCartClick}
          >
            <ShoppingCartIcon className="text-white" />
            {totalItems > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
              >
                {totalItems > 99 ? '99+' : totalItems}
              </motion.span>
            )}
          </motion.div>
          <motion.div 
            className={`w-[45px] h-[45px] flex justify-center items-center border rounded-2xl cursor-pointer text-white transition-all duration-300 hover:bg-neutral-800/50 hover:border-neutral-600 ${
              isDashboardPage 
                ? 'border-white bg-neutral-800/30' 
                : 'border-neutral-700'
            }`}
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAuthClick}
          >
            <PersonIcon className="text-white" />
          </motion.div>
        </>
      )}
      <Link to="/contact" className="focus:outline-none">
        <motion.div 
          className="bg-neutral-100 text-black px-4 py-2 shadow-lg rounded-2xl flex items-center hover:bg-neutral-200 transition-all duration-300 focus:ring-2 focus:ring-neutral-600 focus:ring-offset-2 focus:ring-offset-neutral-900"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          Contact Us
        </motion.div>
      </Link>
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
    { path: "/Composite-tubes", label: "Composite Tubes" },
    { path: "/composite-plates", label: "Composite Plates" },
    { path: "/reinforcement", label: "Reinforcement" },
    { path: "/core-material", label: "Core Material" },
    { path: "/epoxy-system", label: "Epoxy System" },
  ];

  const list = (anchor) => (
    <Box
      className="w-[280px] bg-neutral-900 h-full text-white"
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <div className="p-6">
        <div className="search__drawer mb-6">
          <Form />
        </div>
      </div>
      <Divider className="bg-neutral-800" />
      <List className="px-4">
        {menuItems.map((item, index) => (
          <motion.div
            key={item.path}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <ListItem disablePadding className="my-1">
              <ListItemButton
                component={Link}
                to={item.path}
                className="rounded-xl hover:bg-neutral-800/50 transition-all duration-300"
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  },
                }}
              >
                <ListItemText>
                  <motion.span
                    className="text-white hover:text-white transition-colors duration-300"
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
      <Divider className="bg-neutral-800 my-4" />
      <motion.div 
        className="flex justify-center items-center gap-8 py-8"
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
            <div className="relative w-[60px] h-[60px] border-2 border-neutral-700 rounded-2xl hover:bg-neutral-800/50 transition-all duration-300 group-hover:border-neutral-500 flex items-center justify-center">
              <ShoppingCartIcon className="text-white w-[30px] h-[30px]" />
              {totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center"
                >
                  {totalItems > 99 ? '99+' : totalItems}
                </motion.span>
              )}
            </div>
            <span className="text-neutral-400 text-sm group-hover:text-white transition-colors duration-300">
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
              <div className="w-[60px] h-[60px] border-2 border-neutral-700 rounded-2xl hover:bg-neutral-800/50 transition-all duration-300 group-hover:border-neutral-500 flex items-center justify-center">
                <PersonIcon className="text-white w-[30px] h-[30px]" />
              </div>
              <span className="text-neutral-400 text-sm group-hover:text-white transition-colors duration-300">
                {isLoggedIn ? "Dashboard" : "Account"}
              </span>
            </div>
          </Link>
        </motion.div>
      </motion.div>
      <motion.div 
        className="px-6 py-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        <Link to="/contact" className="no-underline">
          <motion.div 
            className="bg-neutral-100 text-black px-4 py-2 shadow-lg rounded-2xl flex items-center justify-center hover:bg-neutral-200 transition-all duration-300"
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
                backgroundColor: 'rgb(23, 23, 23)',
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

  if (windowWidth <= 780) {
    return null;
  }

  return (
    <motion.ul 
      className="gap-x-2 lg:flex items-center hidden"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      {[
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
            className="flex items-center gap-1 hover:bg-white/5 cursor-pointer px-4 py-2 rounded-2xl text-white hover:text-white transition-all duration-300"
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
    <div className="fixed top-0 left-0 right-0 z-[9999] px-4 pt-4">
      <motion.nav 
        className="py-3 flex items-center justify-between bg-neutral-900 text-white rounded-2xl px-8 w-full max-w-[1536px] mx-auto shadow-lg backdrop-blur-sm"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      >
        <NavBrand />
        <NavLinks />
        <div className="flex items-center gap-x-5">
          <Control isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
          <div className="lg:hidden">
            <DrawerNav isLoggedIn={isLoggedIn} />
          </div>
        </div>
      </motion.nav>
    </div>
  );
};

export default Header;
