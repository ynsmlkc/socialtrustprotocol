import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
    action?: React.ReactNode;
}

export function Card({ children, className = '', title, action }: CardProps) {
    return (
        <div className={`bg-background border border-border flex flex-col ${className}`}>
            {(title || action) && (
                <div className="flex justify-between items-center px-5 py-3 border-b border-border bg-slate-900/20">
                    {title && (
                        <h3 className="text-foreground font-semibold text-xs uppercase tracking-widest">
                            {title}
                        </h3>
                    )}
                    {action && <div>{action}</div>}
                </div>
            )}
            <div className="p-5 flex-1 relative overflow-auto">
                {children}
            </div>
        </div>
    );
}
