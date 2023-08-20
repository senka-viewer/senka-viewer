export const RANKS: number[] = [1, 5, 20, 100, 500];

export const needUpdate = (timestamp: number, now: number): boolean => {
    const time = new Date(timestamp),
        thour = time.getUTCHours();
    time.setUTCMinutes(0, 0, 0);
    if (thour >= 6 && thour < 18) {
        time.setUTCHours(6)
    } else {
        time.setUTCHours(18)
    }
    let time_stamp = time.getTime();
    if (thour < 6) {
        time_stamp -= 24 * 3600 * 1000
    }
    return now - time_stamp >= 12 * 3600 * 1000
};

export const colorsMap: Record<string, string> = {
    'black': '#333',
    'red': '#db2828',
    'orange': '#f2711c',
    'yellow': '#fbbd08',
    'olive': '#a7bd0d',
    'green': '#16ab39',
    'teal': '#009c95',
    'blue': '#1678c2',
    'violet': '#5829bb',
    'pink': '#e61a8d',
    'brown': '#a5673f'
};

export const colors = Object.keys(colorsMap);
