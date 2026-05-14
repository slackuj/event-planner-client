import {createContext, type ReactNode, useContext, useEffect, useState} from 'react';
import * as React from "react";

export type Theme = 'light' | 'dark';
interface ThemeContextType {
    theme: Theme;           // Current theme value
    toggleTheme: () => void; // Function to switch between themes
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

interface ThemeProviderProps {
    children: ReactNode; // Any child components that need access to the theme
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const [theme, setTheme] = useState<Theme>(
        localStorage.getItem('appTheme') as Theme || 'light'
    );

    useEffect(() => {
        document.body.classList.remove('dark', 'light');
        document.body.classList.add('app-theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => {
            prevTheme = prevTheme === 'light' ? 'dark' : 'light';
            // save the theme to localStorage
            localStorage.setItem('appTheme', prevTheme);
            return prevTheme;
        });
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};