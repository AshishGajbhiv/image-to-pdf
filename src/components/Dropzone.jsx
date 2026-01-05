import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

export function Dropzone({ onDrop, compact = false }) {
    const [isDragActive, setIsDragActive] = useState(false);
    const inputRef = useRef(null);

    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            onDrop(Array.from(e.dataTransfer.files));
        }
    };

    const handleChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            onDrop(Array.from(e.target.files));
        }
        // Reset value to allow selecting the same file again if needed
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    const handleClick = () => {
        inputRef.current?.click();
    };

    return (
        <div
            onClick={handleClick}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={clsx(
                "relative cursor-pointer transition-all duration-300 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center group overflow-hidden",
                isDragActive
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-300 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 bg-white dark:bg-gray-800",
                compact ? "h-40" : "h-64 sm:h-80"
            )}
        >
            <input
                ref={inputRef}
                type="file"
                multiple
                accept="image/jpeg, image/png, image/webp"
                className="hidden"
                onChange={handleChange}
            />

            <div className="z-10 flex flex-col items-center gap-4 p-6">
                <div className={clsx(
                    "rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center transition-transform group-hover:scale-110",
                    compact ? "w-12 h-12" : "w-16 h-16 sm:w-20 sm:h-20"
                )}>
                    {compact ? <Plus className="w-6 h-6" /> : <Upload className="w-8 h-8 sm:w-10 sm:h-10" />}
                </div>

                {!compact && (
                    <div className="space-y-2">
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-700 dark:text-gray-200">
                            {isDragActive ? "Drop images here" : "Drag & drop images here"}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            or click to browse files
                        </p>
                    </div>
                )}

                {!compact && (
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                        Supports JPG, PNG, WEBP
                    </p>
                )}
            </div>

            {/* Decorational background Pattern */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
                <svg className="w-full h-full" width="100%" height="100%">
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
            </div>
        </div>
    );
}
