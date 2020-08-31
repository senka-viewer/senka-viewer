export const RANKS = [1, 5, 20, 100, 500];

export const dataZoomIcon = 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z';

export const needUpdate = (timestamp, now) => {
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

export const colorsMap = {
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
