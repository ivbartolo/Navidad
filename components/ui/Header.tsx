import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { Button } from './Button';
import { SunIcon, MoonIcon, BellIcon, PlusIcon, MinusIcon } from '../icons/ChristmasIcons';

interface HeaderProps {
    username: string | null;
}

const fontSizes = ['text-sm', 'text-base', 'text-lg'];

export const Header: React.FC<HeaderProps> = ({ username }) => {
    const [isDark, setIsDark] = useState(false);
    const [fontSizeIndex, setFontSizeIndex] = useState(1);

    useEffect(() => {
        const root = window.document.documentElement;
        if (localStorage.getItem('theme') === 'dark') {
            setIsDark(true);
        } else {
            setIsDark(false);
        }
        
        const storedFontSizeIndex = localStorage.getItem('fontSizeIndex');
        if (storedFontSizeIndex) {
            const index = parseInt(storedFontSizeIndex, 10);
            setFontSizeIndex(index);
            root.classList.remove(...fontSizes);
            root.classList.add(fontSizes[index]);
        }
    }, []);

    const toggleTheme = () => {
        const root = window.document.documentElement;
        root.classList.toggle('dark');
        localStorage.setItem('theme', root.classList.contains('dark') ? 'dark' : 'light');
        setIsDark(!isDark);
    };

    const changeFontSize = (direction: 'increase' | 'decrease') => {
        const root = window.document.documentElement;
        let newIndex = fontSizeIndex;
        if (direction === 'increase' && fontSizeIndex < fontSizes.length - 1) {
            newIndex = fontSizeIndex + 1;
        } else if (direction === 'decrease' && fontSizeIndex > 0) {
            newIndex = fontSizeIndex - 1;
        }
        
        root.classList.remove(fontSizes[fontSizeIndex]);
        root.classList.add(fontSizes[newIndex]);
        setFontSizeIndex(newIndex);
        localStorage.setItem('fontSizeIndex', newIndex.toString());
    };

    return (
        <header className="bg-christmas-red dark:bg-dark-secondary p-4 shadow-lg sticky top-0 z-50">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center text-white">
                    <BellIcon className="w-8 h-8 text-christmas-gold" />
                    <h1 className="text-xl md:text-2xl font-bold ml-2 text-white">Lotería de Navidad</h1>
                </div>
                <div className="flex items-center space-x-2 md:space-x-4">
                    <span className="text-white hidden md:block">¡Hola, {username}!</span>
                    <Button onClick={() => changeFontSize('decrease')} variant="ghost" size="icon" aria-label="Disminuir tamaño de fuente">
                        <MinusIcon className="w-5 h-5 text-white" />
                    </Button>
                    <Button onClick={() => changeFontSize('increase')} variant="ghost" size="icon" aria-label="Aumentar tamaño de fuente">
                        <PlusIcon className="w-5 h-5 text-white" />
                    </Button>
                    <Button onClick={toggleTheme} variant="ghost" size="icon" aria-label="Cambiar tema">
                        {isDark ? <SunIcon className="w-6 h-6 text-christmas-gold" /> : <MoonIcon className="w-6 h-6 text-snow-white" />}
                    </Button>
                    <Button onClick={() => supabase.auth.signOut()} variant="secondary">
                        Salir
                    </Button>
                </div>
            </div>
        </header>
    );
};