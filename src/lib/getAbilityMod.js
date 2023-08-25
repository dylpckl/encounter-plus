export default function getAbilityMod(ability) {
    if (typeof ability !== "number") {
        throw new Error("ability must be a number.");
    }

    if (ability < 1 || ability > 30) {
        throw new Error("ability must be in the range 1 to 30.");
    }

    if (ability === 30) {
        return 10;
    }

    // Calculate the modifier using math operations
    if (ability <= 11) {
        return Math.ceil((ability - 11) / 2);
    } else if (ability <= 21) {
        return Math.floor((ability - 12) / 2);
    } else {
        return ability - 20;
    }
}