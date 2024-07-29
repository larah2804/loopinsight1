export default class DailyProfile {
    profile: Array<[number, number]>;
    type = 'DailyProfile'; 

    constructor(initialProfile: Array<[number, number]>) {
        // Check if array is valid
        if (initialProfile.length < 2 || initialProfile[0][0] !== 0) {
        }

        this.profile = initialProfile;
    }

    // maybe needed in the if query of ParameterConfigObject 
    get [Symbol.toStringTag]() {
        return 'DailyProfile';
    }

    getInterpolation(_t: Date, i: number): number {

        let hours = _t.getHours();
        let minutes = _t.getMinutes() / 60;
        let seconds = _t.getSeconds() / 3600;
        let t = hours + minutes + seconds;

        if (i == 0) {
            let y = 0;
        for (let i = 0; i < this.profile.length; i++) {
            if (this.profile[i][0] <= t) {
                y = this.profile[i][1];
            } else {
            break;
            }
        }   
        return y;
        }
        else if(i == 1) {
            // Überprüft, ob das Profil leer ist oder nur einen Punkt enthält
        if (this.profile.length < 2) {
            return this.profile.length === 1 ? this.profile[0][1] : 0;
        }
    
        // Wenn t kleiner als der erste Zeitpunkt ist, gebe den ersten Wert zurück
        if (t <= this.profile[0][0]) {
            return this.profile[0][1];
        }
    
        // Wenn t größer als der letzte Zeitpunkt ist, gebe den letzten Wert zurück
        let last = this.profile.length - 1;
        if (t >= this.profile[last][0]) {
            return this.profile[last][1];
        }
    
        // Suche die zwei benachbarten Datenpunkte für die Interpolation
        for (let i = 0; i < this.profile.length - 1; i++) {
            if (t < this.profile[i + 1][0]) {
                const x0 = this.profile[i][0];
                const y0 = this.profile[i][1];
                const x1 = this.profile[i + 1][0];
                const y1 = this.profile[i + 1][1];
    
                // Berechne den interpolierten Wert
                const slope = (y1 - y0) / (x1 - x0);
                return y0 + slope * (t - x0);
            }
        }
    
        // Rückgabe des letzten Wertes als Sicherheitsnetz, dieser Code sollte unter normalen Umständen nicht erreicht werden
        return this.profile[last][1];
        }
        else {
           // Überprüfen, ob genügend Datenpunkte vorhanden sind
    if (this.profile.length < 3) {
        console.log("Not enough data points for quadratic interpolation. Need at least 3.");
        return 0;
    }

    // Glättung der Datenpunkte vor der Interpolation
    let smoothedProfile = this.profile.map((point, index, array) => {
        if (index === 0 || index === array.length - 1) return point; // Ersten und letzten Punkt nicht glätten
        const prev = array[index - 1];
        const next = array[index + 1];
        return [point[0], (prev[1] + point[1] + next[1]) / 3]; // Durchschnitt der aktuellen und der beiden benachbarten Werte
    });

    // Suche die drei nächstgelegenen geglätteten Punkte
    let i = 0;
    while (i < smoothedProfile.length - 2 && t > smoothedProfile[i+1][0]) {
        i++;
    }
    if (i > smoothedProfile.length - 3) {
        i = smoothedProfile.length - 3;
    }

    const x0 = smoothedProfile[i][0], y0 = smoothedProfile[i][1];
    const x1 = smoothedProfile[i + 1][0], y1 = smoothedProfile[i + 1][1];
    const x2 = smoothedProfile[i + 2][0], y2 = smoothedProfile[i + 2][1];

    const denom = (x0 - x1) * (x0 - x2) * (x1 - x2);
    if (denom === 0) return y0; // Vermeidung von Division durch Null

    const a = (x2 * (y1 - y0) + x1 * (y0 - y2) + x0 * (y2 - y1)) / denom;
    const b = (x2*x2 * (y0 - y1) + x1*x1 * (y2 - y0) + x0*x0 * (y1 - y2)) / denom;
    const c = (x1 * x2 * (x1 - x2) * y0 + x2 * x0 * (x2 - x0) * y1 + x0 * x1 * (x0 - x1) * y2) / denom;

    // Berechnung des interpolierten Werts
    const interpolatedValue = a * t * t + b * t + c;

    return interpolatedValue;
        }        
    } 

    addEntry(): void {
        const nextIndex = this.profile.length;
        this.profile.push([0,0]);
    }
    removeEntry() {
        if (this.profile.length > 2) {
            this.profile.pop();
        }
    }
    getlength() {
        return this.profile.length;
    }
    getProfile(): Array<[number, number]> {
        return this.profile;
    }
    static fromObject(obj: any): DailyProfile {
        if (!obj || !obj.profileData) {
            throw new TypeError("Object must have a profileData array.");
        }
        return new DailyProfile(obj.profileData);
    }

}