import React from 'react';
import { Moon, Sun, FileUp } from 'lucide-react';
import { motion } from 'framer-motion';

export function Header({ isDark, toggleTheme }) {
    return (
        <header className="sticky top-0 z-50 w-full backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-600 rounded-xl">
                        <FileUp className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        Image2PDF
                    </span>
                </div>
            </div>
        </header>
    );
}
