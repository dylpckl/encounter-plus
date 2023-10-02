import CombatTracker from "@/components/CombatTracker";

import { db } from "@/firebase/config";
import { doc, getDoc } from "firebase/firestore";

async function getEncounterData(encounterId: string) {
  const docRef = doc(db, "encounters", encounterId);
  let docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    console.log("No such document!");
    return;
  }
  return { id: encounterId, ...docSnap.data() };
}

export default async function Page({ params }: { params: { id: string } }) {
  // console.log("params => ", params)
  const encounterData = await getEncounterData(params.id);
  // console.log(encounterData)
  return (
    <>
      <CombatTracker encounter={encounterData} />
    </>
  );
}
