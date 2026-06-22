export function calculateYeast(flour, hours, tempF) {
    const basePercent = 0.015;
    const tempFactor = Math.pow(2, (tempF - 70) / 12.6);
    const timeFactor = 2 / hours;
    let yeastAmount = flour * basePercent * timeFactor / tempFactor;
    return Math.max(0.1, yeastAmount);
}

export function calculateRecipe(inputs) {
    const { baseFlour, loaves, hours, temp, useBiga, hydration, isSourdough } = inputs;

    const totalFlour = baseFlour * loaves;
    const totalWater = Math.round(totalFlour * hydration);
    const totalSalt = Math.round(totalFlour * 0.02);

    let totalYeast = 0;
    let mainFlour = totalFlour;
    let mainWater = totalWater;
    let mainYeast = 0;
    let bigaFlour = 0;
    let bigaWater = 0;
    let bigaYeast = 0;
    let sourdoughStarter = 0;

    if (isSourdough) {
        sourdoughStarter = Math.round(totalFlour * 0.20); // 20% starter
        const starterFlour = Math.round(sourdoughStarter / 2); // 100% hydration assumption
        const starterWater = sourdoughStarter - starterFlour;

        mainFlour = totalFlour - starterFlour;
        mainWater = totalWater - starterWater;
    } else {
        totalYeast = calculateYeast(totalFlour, hours, temp);
        mainYeast = Math.round(totalYeast * 10) / 10;

        if (useBiga) {
            bigaFlour = Math.round(totalFlour * 0.30);
            bigaWater = Math.round(bigaFlour * 0.45);

            const tempFactor = Math.pow(2, (temp - 70) / 12.6);
            const calculatedBigaYeast = bigaFlour * (0.004 / tempFactor);
            bigaYeast = Math.max(0.1, Math.round(calculatedBigaYeast * 10) / 10);

            mainFlour = totalFlour - bigaFlour;
            mainWater = totalWater - bigaWater;

            const supplementalYeastNeeded = calculateYeast(mainFlour, hours, temp);
            const reductionFactor = 0.4 / tempFactor;
            mainYeast = Math.max(0, Math.round((supplementalYeastNeeded * reductionFactor) * 10) / 10);

            totalYeast = bigaYeast + mainYeast;
        } else {
            totalYeast = Math.round(totalYeast * 10) / 10;
            mainYeast = totalYeast;
        }
    }

    // totalFlour and totalWater already include the flour and water that make up the sourdough starter.
    // We only add totalYeast if we're using commercial yeast (sourdoughStarter handles yeast for sourdough).
    const totalDoughWeight = totalFlour + totalWater + totalSalt + totalYeast;

    return {
        totalFlour,
        totalWater,
        totalSalt,
        totalYeast,
        mainFlour,
        mainWater,
        mainYeast,
        bigaFlour,
        bigaWater,
        bigaYeast,
        sourdoughStarter,
        totalDoughWeight
    };
}
