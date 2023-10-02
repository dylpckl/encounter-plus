import CombatTracker from '@/components/CombatTracker'

import { db } from '@/firebase/config';
import { doc, getDoc } from 'firebase/firestore'

async function getEncounterData(encounterId) {
    const docRef = doc(db, "encounters", encounterId)
    let docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
        // console.log("Document data:", docSnap.data());
        return { id: encounterId, ...docSnap.data() }
    } else {
        // console.log("No such document!");
    }
}

export default async function Page({ params }) {
    // console.log("params => ", params)
    const encounterData = await getEncounterData(params.id)
    // console.log(encounterData)
    return (
        <>
            <CombatTracker encounter={encounterData} />
        </>)
}