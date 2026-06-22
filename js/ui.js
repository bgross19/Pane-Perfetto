import { calculateRecipe } from './calculator.js';
import { generateSchedule, formatTime, formatDateString } from './schedule.js';

let currentLang = 'it';

export function getLanguage() {
    return currentLang;
}

export function setLanguage(lang) {
    currentLang = lang;
}

export function updateUI() {
    const flourRange = document.getElementById('flourRange');
    const loafRange = document.getElementById('loafRange');
    const timeRange = document.getElementById('timeRange');
    const tempRange = document.getElementById('tempRange');
    const breadTypeInputs = document.getElementsByName('breadType');
    const bigaToggle = document.getElementById('bigaToggle');
    const startTimeInput = document.getElementById('startTime');

    let hydration = 0.65;
    let isSourdough = false;
    for (const input of breadTypeInputs) {
        if (input.checked) {
            hydration = parseFloat(input.value);
            if (input.id === 'typeSourdough') {
                isSourdough = true;
            }
        }
    }

    const inputs = {
        baseFlour: parseInt(flourRange.value),
        loaves: parseInt(loafRange.value),
        hours: parseInt(timeRange.value),
        temp: parseInt(tempRange.value),
        useBiga: bigaToggle.checked,
        hydration: hydration,
        isSourdough: isSourdough,
        startTime: startTimeInput.value ? new Date(startTimeInput.value) : new Date()
    };

    // Sync UI state for sourdough
    if (isSourdough) {
        bigaToggle.checked = false;
        bigaToggle.disabled = true;
        inputs.useBiga = false;
        document.getElementById('timeRange').parentElement.classList.add('hidden');
        document.getElementById('startTimeContainer').classList.add('hidden');
    } else {
        bigaToggle.disabled = false;
        document.getElementById('timeRange').parentElement.classList.remove('hidden');
        document.getElementById('startTimeContainer').classList.remove('hidden');
    }

    const recipe = calculateRecipe(inputs);
    updateRecipeDisplay(recipe, inputs);

    const steps = generateSchedule(inputs, currentLang);
    updateScheduleDisplay(steps, inputs.useBiga, inputs.isSourdough);
}

function updateRecipeDisplay(recipe, inputs) {
    const { totalFlour, totalWater, totalSalt, totalYeast, mainFlour, mainWater, mainYeast, bigaFlour, bigaWater, bigaYeast, sourdoughStarter, totalDoughWeight } = recipe;
    const { baseFlour, loaves, hours, temp, useBiga, hydration, isSourdough } = inputs;

    const flourDisplay = document.getElementById('flourValue');
    const loafDisplay = document.getElementById('loafValue');
    const timeDisplay = document.getElementById('timeValue');
    const tempDisplay = document.getElementById('tempValue');
    const labelWater = document.getElementById('labelWater');
    const totalWeightDisplay = document.getElementById('totalWeight');

    const bigaSection = document.getElementById('bigaSection');
    const mainDoughTitle = document.getElementById('mainDoughTitle');
    const ricettaTitle = document.getElementById('ricettaTitle');
    const labelMainFlour = document.getElementById('labelMainFlour');
    const labelMainYeast = document.getElementById('labelMainYeast');

    const resBigaFlour = document.getElementById('resBigaFlour');
    const resBigaWater = document.getElementById('resBigaWater');
    const resBigaYeast = document.getElementById('resBigaYeast');

    const resFlour = document.getElementById('resFlour');
    const resWater = document.getElementById('resWater');
    const resSalt = document.getElementById('resSalt');
    const resYeast = document.getElementById('resYeast');

    const sourdoughStarterRow = document.getElementById('sourdoughStarterRow');
    const resSourdoughStarter = document.getElementById('resSourdoughStarter');

    const barFlour = document.getElementById('barFlour');
    const barWater = document.getElementById('barWater');
    const barSalt = document.getElementById('barSalt');
    const barYeast = document.getElementById('barYeast');
    const lblFlourVisual = document.getElementById('lblFlourVisual');
    const lblHydrationVisual = document.getElementById('lblHydrationVisual');

    if (useBiga) {
        resBigaFlour.textContent = bigaFlour + 'g';
        resBigaWater.textContent = bigaWater + 'g';
        resBigaYeast.textContent = bigaYeast + 'g';

        bigaSection.classList.remove('hidden');
        mainDoughTitle.classList.remove('hidden');
        ricettaTitle.innerHTML = currentLang === 'it' ? '<span>📝</span> Ricetta Divisa' : '<span>📝</span> Split Recipe';
        labelMainFlour.textContent = currentLang === 'it' ? 'Farina Rimanente' : 'Remaining Flour';
        labelWater.textContent = currentLang === 'it' ? 'Acqua Rimanente' : 'Remaining Water';
        labelMainYeast.textContent = currentLang === 'it' ? 'Lievito Rimanente' : 'Remaining Yeast';
    } else {
        bigaSection.classList.add('hidden');
        mainDoughTitle.classList.add('hidden');
        ricettaTitle.innerHTML = currentLang === 'it' ? '<span>📝</span> Ricetta Totale' : '<span>📝</span> Total Recipe';

        if (isSourdough) {
            labelMainFlour.textContent = currentLang === 'it' ? 'Farina Principale' : 'Main Flour';
            labelWater.textContent = currentLang === 'it' ? 'Acqua Principale' : 'Main Water';
        } else {
            labelMainFlour.textContent = currentLang === 'it' ? 'Farina' : 'Flour';
            labelWater.textContent = currentLang === 'it' ? `Acqua (${Math.round(hydration * 100)}%)` : `Water (${Math.round(hydration * 100)}%)`;
            labelMainYeast.textContent = currentLang === 'it' ? 'Lievito Secco' : 'Dry Yeast';
        }
    }

    if (isSourdough) {
        sourdoughStarterRow.classList.remove('hidden');
        resSourdoughStarter.textContent = sourdoughStarter + 'g';
        // Hide dry yeast
        document.getElementById('resYeast').parentElement.classList.add('hidden');
    } else {
        sourdoughStarterRow.classList.add('hidden');
        document.getElementById('resYeast').parentElement.classList.remove('hidden');
    }

    // Mass Composition Visualization calculation with sourdough
    const effectiveYeastWeight = isSourdough ? sourdoughStarter : totalYeast;

    const trueFlourPct = (totalFlour / totalDoughWeight) * 100;
    const trueWaterPct = (totalWater / totalDoughWeight) * 100;
    const trueSaltPct = (totalSalt / totalDoughWeight) * 100;
    const trueYeastPct = (effectiveYeastWeight / totalDoughWeight) * 100;

    barFlour.style.width = `${trueFlourPct}%`;
    barWater.style.width = `${trueWaterPct}%`;
    barSalt.style.width = `${trueSaltPct}%`;
    barYeast.style.width = `${trueYeastPct}%`;

    barFlour.title = currentLang === 'it' ? `Farina: ${trueFlourPct.toFixed(1)}%` : `Flour: ${trueFlourPct.toFixed(1)}%`;
    barWater.title = currentLang === 'it' ? `Acqua: ${trueWaterPct.toFixed(1)}%` : `Water: ${trueWaterPct.toFixed(1)}%`;
    barSalt.title = currentLang === 'it' ? `Sale: ${trueSaltPct.toFixed(1)}%` : `Salt: ${trueSaltPct.toFixed(1)}%`;
    barYeast.title = currentLang === 'it' ? (isSourdough ? `Lievito Madre: ${trueYeastPct.toFixed(1)}%` : `Lievito: ${trueYeastPct.toFixed(1)}%`) : (isSourdough ? `Starter: ${trueYeastPct.toFixed(1)}%` : `Yeast: ${trueYeastPct.toFixed(1)}%`);

    lblFlourVisual.textContent = currentLang === 'it' ? `Farina (${Math.round(trueFlourPct)}%)` : `Flour (${Math.round(trueFlourPct)}%)`;
    lblHydrationVisual.textContent = currentLang === 'it' ? `Acqua (${Math.round(trueWaterPct)}%)` : `Water (${Math.round(trueWaterPct)}%)`;

    flourDisplay.textContent = baseFlour + 'g';
    loafDisplay.textContent = loaves;
    timeDisplay.textContent = hours + (currentLang === 'it' ? ' ore' : ' hrs');
    tempDisplay.textContent = temp + '°F';

    resFlour.textContent = mainFlour + 'g';
    resWater.textContent = mainWater + 'g';
    resSalt.textContent = totalSalt + 'g';
    resYeast.textContent = mainYeast + 'g';
    totalWeightDisplay.textContent = totalDoughWeight.toFixed(0) + 'g';
}

function updateScheduleDisplay(steps, useBiga, isSourdough) {
    const scheduleContainer = document.getElementById('scheduleContainer');
    scheduleContainer.innerHTML = steps.map(s => `
        <div class="flex items-center justify-between border-l-2 border-${s.color} pl-3">
            <div>
                <p class="font-bold text-gray-800">${s.title[currentLang]}</p>
                <p class="text-gray-500 text-[10px]">${s.desc[currentLang]}</p>
            </div>
            <div class="text-right flex flex-col items-end">
                <span class="${s.text ? `text-${s.text}` : 'text-gray-700'} ${s.text === 'white' ? `bg-${s.color} px-2 py-0.5 rounded shadow-sm` : ''} font-bold">${formatTime(s.time, currentLang)}</span>
                ${(useBiga || isSourdough) ? `<span class="text-[9px] text-gray-400 mt-0.5">${formatDateString(s.date, currentLang)}</span>` : ''}
            </div>
        </div>
    `).join('');
}
