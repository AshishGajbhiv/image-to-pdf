import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay
} from '@dnd-kit/core';
import {
  arrayMove,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { Header } from './components/Header';
import { Dropzone } from './components/Dropzone';
import { ImageGrid } from './components/ImageGrid';
import { PdfControls } from './components/PdfControls';
import { Footer } from './components/Footer';
import { ImagePreviewModal } from './components/ImagePreviewModal';
import { generatePDF } from './utils/pdfGenerator';
import { motion } from 'framer-motion';

// Simple ID generator since I didn't verify uuid install in plan
const generateId = () => Math.random().toString(36).substr(2, 9);

function App() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const [items, setItems] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [settings, setSettings] = useState({ format: 'a4' });
  const [previewImage, setPreviewImage] = useState(null);

  // Theme connection
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  // DnD Sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleFilesDrop = (files) => {
    const newItems = files.map(file => ({
      id: generateId(),
      file,
      rotation: 0
    }));
    setItems(prev => [...prev, ...newItems]);
  };

  const handleRemove = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const handleRotate = (id) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, rotation: (item.rotation + 90) % 360 };
      }
      return item;
    }));
  };

  const handleGeneratePDF = async () => {
    if (items.length === 0) return;
    setIsGenerating(true);
    try {
      await generatePDF(items, settings);
    } catch (error) {
      console.error("PDF Generation failed", error);
      alert("Failed to generate PDF. See console.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Header isDark={isDark} toggleTheme={toggleTheme} />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">

          {/* Initial Empty State / Dropzone */}
          <div className="mb-10">
            <Dropzone
              onDrop={handleFilesDrop}
              compact={items.length > 0}
            />
          </div>

          {items.length > 0 && (
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left Panel: Images */}
              <div className="flex-1">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                    {items.length} Images Selected
                  </h2>
                  <button
                    onClick={() => setItems([])}
                    className="text-sm text-red-500 hover:text-red-600 font-medium"
                  >
                    Clear All
                  </button>
                </div>

                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <ImageGrid
                    items={items}
                    onRemove={handleRemove}
                    onRotate={handleRotate}
                    onZoom={setPreviewImage}
                  />
                </DndContext>
              </div>

              {/* Right Panel: Controls */}
              <div className="w-full lg:w-80 flex-shrink-0">
                <PdfControls
                  settings={settings}
                  onSettingsChange={setSettings}
                  onGenerate={handleGeneratePDF}
                  isGenerating={isGenerating}
                />
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />

      <ImagePreviewModal
        isOpen={!!previewImage}
        imageUrl={previewImage}
        onClose={() => setPreviewImage(null)}
      />
    </div>
  );
}

export default App;