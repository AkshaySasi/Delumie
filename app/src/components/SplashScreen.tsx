import { motion } from 'framer-motion';
import '../logo-depth.css';

export default function SplashScreen() {
    return (
        <div className="flex flex-col items-center justify-center h-screen w-screen bg-gradient-to-br from-[#F8F6F3] to-[#E8E6E3]">
            {/* Logo with animations */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                    opacity: 1,
                    scale: 1,
                }}
                transition={{
                    duration: 0.6,
                    ease: "easeOut"
                }}
                className="relative"
            >
                {/* Pulse glow effect */}
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute inset-0 bg-sage-400/20 rounded-full blur-3xl"
                />

                {/* Logo image */}
                <img
                    src="/logo.png"
                    alt="Delumie"
                    className="w-80 h-80 relative z-10 logo-depth-strong"
                />
            </motion.div>

            {/* App name */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    delay: 0.8,
                    duration: 0.5
                }}
                className="mt-8"
            >
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sage-700 to-sage-500">
                    Delumie
                </h1>
                <p className="text-sm text-gray-500 text-center mt-2">Your AI Health Companion</p>
            </motion.div>

            {/* Loading indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="mt-12 w-48"
            >
                <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{
                            duration: 2.5,
                            ease: "easeInOut",
                            delay: 1.2
                        }}
                        className="h-full bg-sage-500"
                    />
                </div>
                <p className="text-xs text-gray-400 text-center mt-2 font-medium">Initializing Engine...</p>
            </motion.div>
        </div>
    );
}
