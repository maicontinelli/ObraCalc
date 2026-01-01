import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface Option {
    value: string;
    label: string;
}

interface CustomSelectProps {
    label?: string;
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export function CustomSelect({ label, options, value, onChange, placeholder = "Selecione..." }: CustomSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(opt => opt.value === value);

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative" ref={containerRef}>
            {label && (
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                    {label}
                </label>
            )}

            <button
                type="button"
                className={`w-full flex items-center justify-between rounded-xl border px-4 py-3 text-left transition-all duration-200 outline-none
                    ${isOpen
                        ? 'border-primary ring-2 ring-primary/20 bg-background'
                        : 'border-input bg-background hover:border-accent hover:bg-accent/50'
                    }
                `}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className={`block truncate ${!selectedOption ? 'text-muted-foreground' : 'text-foreground font-medium'}`}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown
                    size={16}
                    className={`text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {isOpen && (
                <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-xl animate-in fade-in zoom-in-95 duration-100">
                    <div className="max-h-[240px] overflow-auto p-1">
                        {options.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                className={`relative flex w-full cursor-pointer select-none items-center rounded-lg py-2.5 pl-3 pr-9 text-sm outline-none transition-colors
                                    ${option.value === value
                                        ? 'bg-accent text-accent-foreground font-medium'
                                        : 'text-foreground hover:bg-muted'
                                    }
                                `}
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                            >
                                <span className="block truncate">{option.label}</span>
                                {option.value === value && (
                                    <span className="absolute right-3 flex h-3.5 w-3.5 items-center justify-center text-primary">
                                        <Check size={14} />
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
