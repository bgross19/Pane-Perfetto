const timeFormatterIt = new Intl.DateTimeFormat('it-IT', { hour: '2-digit', minute: '2-digit' });
const timeFormatterEn = new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit' });
const dateFormatterIt = new Intl.DateTimeFormat('it-IT', { weekday: 'short', month: 'short', day: 'numeric' });
const dateFormatterEn = new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

export function formatTime(date, currentLang) {
    return (currentLang === 'it' ? timeFormatterIt : timeFormatterEn).format(date);
}

export function formatDateString(date, currentLang) {
    return (currentLang === 'it' ? dateFormatterIt : dateFormatterEn).format(date);
}

export function generateSchedule(inputs, currentLang) {
    const { hours, useBiga, isSourdough, startTime } = inputs;
    const now = isSourdough ? new Date() : new Date(startTime);
    let steps = [];

    if (isSourdough) {
        // Multi-day itinerary for sourdough
        const firstFeedingTime = new Date(now);
        firstFeedingTime.setHours(8, 0, 0, 0); // 8:00 AM Day 1
        if (now.getHours() >= 8) {
             firstFeedingTime.setDate(firstFeedingTime.getDate() + 1); // If past 8am, start tomorrow
        }

        const secondFeedingTime = new Date(firstFeedingTime.getTime() + 12 * 3600000); // 8:00 PM Day 1
        const mixTime = new Date(secondFeedingTime.getTime() + 12 * 3600000); // 8:00 AM Day 2
        const fold1Time = new Date(mixTime.getTime() + 30 * 60000); // 8:30 AM Day 2
        const bulkEnd = new Date(mixTime.getTime() + 5 * 3600000); // 1:00 PM Day 2 (5 hrs bulk)
        const coldRetardEnd = new Date(bulkEnd.getTime() + 15 * 3600000); // 4:00 AM Day 3 (approx 15 hrs)
        const bakeTime = new Date(coldRetardEnd.getTime() + 4 * 3600000); // 8:00 AM Day 3
        const coolingTime = new Date(bakeTime.getTime() + 1 * 3600000); // 9:00 AM Day 3

        steps = [
            {
                title: { it: "1° Rinfresco", en: "1st Feeding" },
                desc: { it: "Nutri il lievito madre (es. 1:1:1).", en: "Feed your sourdough starter (e.g. 1:1:1)." },
                time: firstFeedingTime, date: firstFeedingTime, color: "orange-600"
            },
            {
                title: { it: "2° Rinfresco", en: "2nd Feeding" },
                desc: { it: "Nutri di nuovo per massimizzare la forza.", en: "Feed again to maximize strength." },
                time: secondFeedingTime, date: secondFeedingTime, color: "orange-500"
            },
            {
                title: { it: "Impasto", en: "Mix Dough" },
                desc: { it: "Mischia il lievito attivo con farina, acqua e sale.", en: "Mix active starter with flour, water, salt." },
                time: mixTime, date: mixTime, color: "orange-400"
            },
            {
                title: { it: "Pieghe (Stretch & Fold)", en: "Stretch & Fold" },
                desc: { it: "Esegui 3-4 serie di pieghe ogni 30 min.", en: "Perform 3-4 sets of folds every 30 mins." },
                time: fold1Time, date: fold1Time, color: "orange-300"
            },
            {
                title: { it: "Formatura & Frigo", en: "Shape & Cold Retard" },
                desc: { it: "Forma la pagnotta e mettila in frigo.", en: "Shape loaf and place in fridge." },
                time: bulkEnd, date: bulkEnd, color: "blue-400"
            },
            {
                title: { it: "Infornare", en: "Bake" },
                desc: { it: "Forno a 450°F direttamente dal frigo.", en: "Bake at 450°F straight from fridge." },
                time: bakeTime, date: bakeTime, color: "stone-800", text: "white"
            },
            {
                title: { it: "Pronto", en: "Ready" },
                desc: { it: "Lascia raffreddare completamente.", en: "Let cool completely before slicing." },
                time: coolingTime, date: coolingTime, color: "green-400", text: "green-800"
            }
        ];
    } else if (useBiga) {
        const bigaTime = new Date(now);
        const mainMixTime = new Date(now.getTime() + 12 * 3600000);
        const foldTime = new Date(mainMixTime.getTime() + 30 * 60000);
        const bakeTime = new Date(mainMixTime.getTime() + hours * 3600000);
        const coolingTime = new Date(bakeTime.getTime() + 45 * 60000);

        steps = [
            {
                title: { it: "Preparazione Biga", en: "Mix Biga" },
                desc: { it: "Impasta la Biga. Lascia a temperatura ambiente.", en: "Mix the preferment. Rest at room temp." },
                time: bigaTime, date: bigaTime, color: "orange-600"
            },
            {
                title: { it: "Impasto Principale", en: "Main Dough" },
                desc: { it: "Aggiungi gli ingredienti rimanenti.", en: "Add remaining ingredients to the Biga." },
                time: mainMixTime, date: mainMixTime, color: "orange-500"
            },
            {
                title: { it: "Primo Set di Pieghe", en: "First Fold" },
                desc: { it: "Rafforza la maglia glutinica.", en: "Strengthen the dough structure." },
                time: foldTime, date: foldTime, color: "orange-300"
            },
            {
                title: { it: "Infornare", en: "Bake" },
                desc: { it: "Forno a 450°F (preriscalda la pentola!).", en: "450°F oven (preheat Dutch oven!)." },
                time: bakeTime, date: bakeTime, color: "stone-800", text: "white"
            },
            {
                title: { it: "Pronto da Mangiare", en: "Ready to Eat" },
                desc: { it: "Raffreddamento completato. Taglia!", en: "Cooling complete. Slice it!" },
                time: coolingTime, date: coolingTime, color: "green-400", text: "green-800"
            }
        ];
    } else {
        const start = new Date(now);
        const fold1 = new Date(now.getTime() + 30 * 60000);
        const bakeTime = new Date(now.getTime() + hours * 3600000);
        const coolingTime = new Date(bakeTime.getTime() + 45 * 60000);

        steps = [
            {
                title: { it: "Impasto Iniziale", en: "Initial Mix" },
                desc: { it: "Mischia farina, acqua, lievito e sale.", en: "Mix flour, water, yeast, and salt." },
                time: start, date: start, color: "orange-500"
            },
            {
                title: { it: "Primo Set di Pieghe", en: "First Fold" },
                desc: { it: "Rafforza l'impasto.", en: "Strengthen the dough." },
                time: fold1, date: fold1, color: "orange-300"
            },
            {
                title: { it: "Infornare", en: "Bake" },
                desc: { it: "Preriscalda la pentola 30 min prima.", en: "Preheat Dutch oven 30 mins before this." },
                time: bakeTime, date: bakeTime, color: "stone-800", text: "white"
            },
            {
                title: { it: "Pronto da Mangiare", en: "Ready to Eat" },
                desc: { it: "Raffreddamento completato. Taglia!", en: "Cooling complete. Slice it!" },
                time: coolingTime, date: coolingTime, color: "green-400", text: "green-800"
            }
        ];
    }

    return steps;
}