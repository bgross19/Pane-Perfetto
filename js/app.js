import { updateUI, getLanguage, setLanguage } from './ui.js';

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then((registration) => {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, (err) => {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const btnIt = document.getElementById('btnIt');
    const btnEn = document.getElementById('btnEn');

    btnIt.addEventListener('click', () => {
        setLanguage('it');
        body.classList.replace('lang-en', 'lang-it');
        btnIt.classList.replace('text-gray-400', 'text-orange-900');
        btnEn.classList.replace('text-orange-900', 'text-gray-400');
        updateUI();
    });

    btnEn.addEventListener('click', () => {
        setLanguage('en');
        body.classList.replace('lang-it', 'lang-en');
        btnEn.classList.replace('text-gray-400', 'text-orange-900');
        btnIt.classList.replace('text-orange-900', 'text-gray-400');
        updateUI();
    });

    const flourRange = document.getElementById('flourRange');
    const loafRange = document.getElementById('loafRange');
    const timeRange = document.getElementById('timeRange');
    const tempRange = document.getElementById('tempRange');
    const breadTypeInputs = document.getElementsByName('breadType');
    const bigaToggle = document.getElementById('bigaToggle');

    function handleBreadTypeChange(e) {
        if (e.target.id === 'typePizza') {
            flourRange.value = 150;
        } else if (e.target.id !== 'typePizza' && parseInt(flourRange.value) < 250) {
            flourRange.value = 500;
        }

        updateUI();
    }

    flourRange.addEventListener('input', updateUI);
    loafRange.addEventListener('input', updateUI);
    timeRange.addEventListener('input', updateUI);
    tempRange.addEventListener('input', updateUI);
    bigaToggle.addEventListener('change', updateUI);
    breadTypeInputs.forEach(input => input.addEventListener('change', handleBreadTypeChange));

    updateUI();
});
