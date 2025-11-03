import React from 'react';

export const Spinner: React.FC = () => {
    return (
        <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-christmas-gold dark:border-christmas-red"></div>
        </div>
    );
};