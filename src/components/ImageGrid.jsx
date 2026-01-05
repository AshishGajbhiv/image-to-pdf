import React from 'react';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { SortableImage } from './SortableImage';
import { AnimatePresence, motion } from 'framer-motion';

export function ImageGrid({ items, onRemove, onRotate, onZoom }) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            <SortableContext items={items} strategy={rectSortingStrategy}>
                <AnimatePresence>
                    {items.map((item, index) => (
                        <motion.div
                            key={item.id}
                            layout
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                        >
                            <SortableImage
                                id={item.id}
                                file={item.file}
                                rotation={item.rotation}
                                index={index}
                                onRemove={onRemove}
                                onRotate={onRotate}
                                onZoom={onZoom}
                            />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </SortableContext>
        </div>
    );
}
