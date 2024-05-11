export function Interpolation(stuetzstellen: number[][], time: number) {
    let y = 0;

    for (let i = 0; i < stuetzstellen.length; i++) {
        if (stuetzstellen[i][0] <= time) {
            y = stuetzstellen[i][1];
        } else {
            break;
        }
    }
    return y;
}

export function kp1Berechnung(time: number, increase: number, start: number) {
    let y = 0;
    let m = 0;
    let c = 0;
    if (time >= 3 && time <= 7) {
        m = increase / 4;
        c = start - 3 * m;
        y = m * time + c;
    } else if (time > 7 && time <= 9) {
        m = -increase / 2;
        c = start - 9 * m;
        y = m * time + c;
    } else {
        y = start;
    }
    return y;
}

export function kirBerechnung(time: number, increase: number, start: number) {
    let y = 0;
    let m = 0;
    let c = 0;
    if (time >= 3 && time <= 7) {
        m = -increase / 4;
        c = start - 3 * m;
        y = m * time + c;
    } else if (time > 7 && time <= 9) {
        m = increase / 2;
        c = start - 9 * m;
        y = m * time + c;
    } else {
        y = start;
    }
    return y;
}

export function Klasse(SI: number, parameter: number, parameter1: number, parameter2: number, parameter3: number, parameter4: number) {
    let stuetzstellen: number[][];

    switch (SI) {
        case 0: // Klasse mit konstanter Insulinsensivität
            stuetzstellen = [[0, parameter], [4, parameter], [11, parameter], [17, parameter]];
            break;
        case 2: // Auftrittswahrscheinlichkeit von 5 %
            stuetzstellen = [[0, 0.75 * parameter], [4, parameter], [11, parameter], [17, 0.75 * parameter]]
            break;
        case 7: // Klasse mit höchster Auftrittswahrscheinlichkeit von 30%
            stuetzstellen = [[0, parameter], [4, 0.75 * parameter], [11, 0.75 * parameter], [17, parameter]];
            break;
        case 8: // vom Benutzer definierte Klasse
            stuetzstellen = [[0, parameter1], [4, parameter2], [11, parameter3], [17, parameter4]]
            break;
        default:
            stuetzstellen = [];
    }
    return stuetzstellen;
}


