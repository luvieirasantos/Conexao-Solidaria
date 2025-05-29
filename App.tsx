import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { Navigation } from './src/navigation';
import { theme } from './src/styles/theme';

const App = () => {
    return (
        <PaperProvider theme={theme}>
            <Navigation />
        </PaperProvider>
    );
};

export default App; 