import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { X, RotateCw, ZoomIn, GripVertical } from 'lucide-react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

export function SortableImage({ id, file, rotation, index, onRemove, onRotate, onZoom, activeIndex }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1,
    };

    const objectUrl = React.useMemo(() => URL.createObjectURL(file), [file]);

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={clsx(
                "group relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700 select-none",
                isDragging && "shadow-xl ring-2 ring-blue-500 opacity-80 cursor-grabbing"
            )}
        >
            {/* Image Container */}
            <div className="aspect-[3/4] p-3 flex items-center justify-center bg-gray-50 dark:bg-gray-900/50 relative overflow-hidden">
                {/* Page Number Badge */}
                <div className="absolute top-2 left-2 z-10 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center text-xs font-medium backdrop-blur-sm">
                    {index + 1}
                </div>

                {/* Image Display */}
                <img
                    src={objectUrl}
                    alt={`Page ${index + 1}`}
                    className="w-full h-full object-contain shadow-md bg-white transition-transform duration-300 pointer-events-none"
                    style={{ transform: `rotate(${rotation}deg)` }}
                />

                {/* Overlay with Quick Actions (Hover) */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[1px]">
                    <button
                        onClick={() => onZoom(objectUrl)}
                        className="p-2 rounded-full bg-white/20 text-white hover:bg-white/40 transition-colors"
                        title="View Fullscreen"
                    >
                        <ZoomIn className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Controls Footer */}
            <div className="p-3 flex items-center justify-between border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
                <div {...attributes} {...listeners} className="cursor-grab hover:text-blue-500 text-gray-400">
                    <GripVertical className="w-5 h-5" />
                </div>

                <div className="flex items-center gap-1">
                    <button
                        onClick={() => onRotate(id)}
                        className="p-1.5 rounded-md text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                        title="Rotate 90°"
                    >
                        <RotateCw className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => onRemove(id)}
                        className="p-1.5 rounded-md text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        title="Remove page"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
