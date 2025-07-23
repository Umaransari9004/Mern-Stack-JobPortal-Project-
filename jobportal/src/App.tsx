import React from "react";
import { createTheme, MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import '@mantine/carousel/styles.css';
import '@mantine/tiptap/styles.css';
import '@mantine/notifications/styles.css';
import './App.css';
import store from './Store.tsx';  
import { Provider } from 'react-redux';
import AppRoutes from './Pages/AppRoutes.tsx';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import { Notifications } from '@mantine/notifications';
import { BrowserRouter } from "react-router-dom";



const persistor = persistStore(store);

function App() {
  const theme = createTheme({
    focusRing: "never",
    fontFamily: "poppins, sans-serif",
    primaryColor: "blue",
    primaryShade: 4,
    colors: {
      'picton-blue': [
        '#effaff', '#def4ff', '#b6ebff', '#75deff', '#2ccfff',
        '#00bfff', '#0095d4', '#0076ab', '#00638d', '#065374', '#04344d'
      ],
    },
  });

  return (
    
    <React.StrictMode>
      <Provider store={store} >
        <PersistGate loading={null} persistor={persistor}>
          <MantineProvider theme={theme}>
            <Notifications position="top-center" zIndex={1000}/>
            <BrowserRouter>
            <AppRoutes />
            </BrowserRouter>
          </MantineProvider>
        </PersistGate>
      </Provider>
    </React.StrictMode>
  );
}

export default App;
