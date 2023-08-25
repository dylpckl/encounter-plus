import rollDie from './rollDie'
import getAbilityMod from "./getAbilityMod"

export default function rollInitiative(dexterityScore) {
    const rolledInitiative = rollDie(20) + getAbilityMod(dexterityScore);
    // console.log("rolled init: " + init + rollDie(20) + getAbilityMod(dex));
    return rolledInitiative;
}