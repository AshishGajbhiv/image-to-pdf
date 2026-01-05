import React from 'react';
import { FileDown, Settings2, Check } from 'lucide-react';
import clsx from 'clsx';

export function PdfControls({ onGenerate, isGenerating, settings, onSettingsChange }) {
    const pageSizes = [
        { id: 'a4', label: 'A4', sub: '210 x 297 mm' },
        { id: 'letter', label: 'Letter', sub: '216 x 279 mm' },
        { id: 'fit', label: 'Fit to Image', sub: 'Original Size' },
    ];

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sticky top-24">
            <div className="flex items-center gap-2 mb-6 text-gray-800 dark:text-gray-100 font-semibold">
                <Settings2 className="w-5 h-5" />
                <h2>PDF Settings</h2>
            </div>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Page Size
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                        {pageSizes.map((size) => (
                            <button
                                key={size.id}
                                onClick={() => onSettingsChange({ ...settings, format: size.id })}
                                className={clsx(
                                    "flex items-center justify-between p-3 rounded-xl border text-left transition-all",
                                    settings.format === size.id
                                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-1 ring-blue-500"
                                        : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                                )}
                            >
                                <div>
                                    <div className={clsx(
                                        "font-medium",
                                        settings.format === size.id ? "text-blue-700 dark:text-blue-400" : "text-gray-900 dark:text-gray-100"
                                    )}>
                                        {size.label}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                        {size.sub}
                                    </div>
                                </div>
                                {settings.format === size.id && (
                                    <Check className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                    <button
                        onClick={onGenerate}
                        disabled={isGenerating}
                        className={clsx(
                            "w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-bold text-white shadow-lg shadow-blue-500/20 transition-all transform active:scale-[0.98]",
                            isGenerating
                                ? "bg-blue-400 cursor-wait"
                                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 hover:shadow-xl hover:-translate-y-0.5"
                        )}
                    >
                        {isGenerating ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Generating PDF...
                            </>
                        ) : (
                            <>
                                <FileDown className="w-5 h-5" />
                                Convert to PDF
                            </>
                        )}
                    </button>
                    <p className="text-xs text-center text-gray-400 mt-3">
                        Processed locally in your browser
                    </p>
                </div>
            </div>
        </div>
    );
}
