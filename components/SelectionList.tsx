import React from 'react';
import { motion } from 'framer-motion';

interface Option {
    value: string;
    label: string;
    icon?: React.ReactNode;
}

interface SelectionListProps {
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    label?: string;
}

export function SelectionList({ options, value, onChange, label }: SelectionListProps) {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-muted-foreground mb-2 text-center sm:text-left">
                    {label}
                </label>
            )}
            <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
                <div className="flex flex-col">
                    {options.map((option) => {
                        const isSelected = value === option.value;
                        return (
                            <div
                                key={option.value}
                                onClick={() => onChange(option.value)}
                                className={`
                                    relative flex items-center justify-between p-2 cursor-pointer transition-all duration-200
                                    ${isSelected ? 'bg-accent/10' : 'hover:bg-accent/5'}
                                `}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`
                                        w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200
                                        ${isSelected
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-muted text-muted-foreground'
                                        }
                                    `}>
                                        {option.icon}
                                    </div>
                                    <span className={`text-sm font-medium ${isSelected ? 'text-foreground' : 'text-muted-foreground'}`}>
                                        {option.label}
                                    </span>
                                </div>

                                {/* Toggle Switch Simulation */}
                                <div className={`
                                    w-10 h-6 rounded-full transition-colors duration-300 relative
                                    ${isSelected ? 'bg-primary' : 'bg-input'}
                                `}>
                                    <motion.div
                                        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                                        initial={false}
                                        animate={{
                                            left: isSelected ? 'calc(100% - 18px)' : '2px'
                                        }}
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
