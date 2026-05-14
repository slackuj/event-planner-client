import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './reset.css';
import {App} from './App.tsx'
import {BrowserRouter} from "react-router";
import {Provider} from "react-redux";
import {store} from "./store/store.ts";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Provider store={store}>
            {/*<ThemeProvider>*/}
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            {/*</ThemeProvider>*/}
        </Provider>
    </StrictMode>,
)
