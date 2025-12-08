import React from 'react';

export default function SimpleNav() {
    return (
        <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <a href="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            ObraCalc
                        </a>
                    </div>
                    <div className="flex items-center space-x-6">
                        <a href="/planos" className="text-gray-700 dark:text-gray-300 hover:text-blue-600">Planos</a>
                        <a href="/sobre" className="text-gray-700 dark:text-gray-300 hover:text-blue-600">Sobre</a>
                        <a href="/contato" className="text-gray-700 dark:text-gray-300 hover:text-blue-600">Contato</a>
                        <a href="/apoie" className="text-gray-700 dark:text-gray-300 hover:text-blue-600">Apoie</a>
                    </div>
                </div>
            </div>
        </nav>
    );
}
