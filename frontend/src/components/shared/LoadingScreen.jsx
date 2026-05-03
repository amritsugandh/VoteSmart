import { motion } from 'framer-motion';
import './LoadingScreen.css';

export default function LoadingScreen() {
  return (
    <motion.div 
      className="loading-screen"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <div className="loading-content">
        <motion.div 
          className="loading-logo"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <img src="/assets/logo-CenrKkUn.png" alt="VoteSmart India" onError={(e) => e.target.src = "https://api.dicebear.com/7.x/bottts/svg?seed=Kiran"} />
        </motion.div>
        
        <motion.h1 
          className="loading-title gradient-text"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          VoteSmart India
        </motion.h1>
        
        <div className="loading-bar-container">
          <motion.div 
            className="loading-bar"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
        </div>
        
        <motion.p 
          className="loading-text"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Initializing Secure Portal...
        </motion.p>
      </div>
    </motion.div>
  );
}
