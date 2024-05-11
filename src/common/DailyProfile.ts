type Point = [number, number];

export default class DailyProfile {
    profile: Point[];

    constructor(initialProfile: Point[]) {
        // Überprüfung, ob das Array gültig ist
        if (initialProfile.length < 2 || initialProfile[0][0] !== 0) {
            //throw new Error("Initialprofile muss mindestens zwei Einträge haben und der erste Eintrag muss [0, x] sein.");
        }

        this.profile = initialProfile;
    }

    getProfile(t: number ): number {
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

}