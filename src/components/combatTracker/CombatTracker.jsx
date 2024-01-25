"use client";

// External
import {
  Fragment,
  useState,
  useEffect,
  useRef,
  forwardRef,
  Suspense,
  useReducer,
} from "react";
import { nanoid } from "nanoid";
import { Dialog, Transition, Switch } from "@headlessui/react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import toast from "react-hot-toast";

// Components
import MonsterCard from "@/components/combatTracker/MonsterCard";
import CharacterCard from "@/components/combatTracker/CharacterCard";
import AddMonster from "@/components/combatTracker/AddMonster";
import Stopwatch from "@/components/combatTracker/Stopwatch";
import Setup from "@/components/combatTracker/Setup";
import { Button } from "../Button";

// Utils
import rollInitiative from "@/lib/rollInitiative";
import useDebounce from "@/lib/hooks/useDebounce";

// Icons
import {
  ClockIcon,
  HeartIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlayIcon,
  PlusIcon,
  XMarkIcon,
  UserGroupIcon,
  ArrowPathIcon,
  BackwardIcon,
  ForwardIcon,
} from "@heroicons/react/24/outline";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const CHARACTERS = [
  {
    id: 1,
    name: "Strongheart",
    armorClass: 17,
  },
  {
    id: 2,
    name: "Elkhorn",
    armorClass: 11,
  },
];

function combatantReducer(combatants, action) {
  combatants = combatants || [];

  switch (action.type) {
    case "added_combatants":
      return [...combatants, ...action.newCombatants];
    case "deleted_combatant":
      return combatants.filter((c) => c.id !== action.id);
    case "undo_deleted_combatant":
      return [...combatants, action.monster];
    case "updated_combatant":
      // console.log(
      //   "updated_conditions: ",
      //   action.combatant,
      //   action.key,
      //   action.newValue
      // );
      return (
        combatants &&
        combatants.map((c) => {
          if (c.id === action.monster.id) {
            return {
              ...c,
              [action.key]: action.newValue,
            };
          } else {
            return c;
          }
        })
      );
    case "updated_conditions":
      return combatants.map((c) => {
        if (c.id === action.combatant.id) {
          if (action.condition === "CLEAR") {
            return {
              ...c,
              conditions: {
                BLND: false,
                CHRM: false,
                DEAF: false,
                FRGHT: false,
                GRPL: false,
                INCAP: false,
                INVIS: false,
                PRLZ: false,
                PETR: false,
                POIS: false,
                PRNE: false,
                REST: false,
                STUN: false,
                UNCON: false,
              },
            };
          } else {
            return {
              ...c,
              conditions: {
                ...c.conditions,
                [action.condition]: !c.conditions[action.condition],
              },
            };
          }
        } else {
          return c;
        }
      });
    case "fetched_combatants":
      return action.combatants;
    case "clear_initiative":
      return [];
    case "start_combat":
      const sortedCombatants = combatants
        .slice()
        .sort((a, b) => b.init - a.init);
      // console.log(sortedMonsters);
      // Mark the monster with the highest "init" value as active
      const updatedCombatants = sortedCombatants.map((monster, index) => ({
        ...monster,
        active: index === 0, // Set the first monster as active
      }));
      return updatedCombatants;
      // case "next_turn":
      return combatants.map((c) => {
        if (c.active) {
          // return combatants with active set to false and the next index set to true
          const updatedCombatants = [...combatants];
          updatedCombatants[combatants.indexOf(c)].active = false;
          updatedCombatants[
            combatants.indexOf(c) + 1 < combatants.length
              ? combatants.indexOf(c) + 1
              : 0
          ].active = true;
          return updatedCombatants;
        } else {
          return c;
        }
      });

    default: {
      throw Error("unknown action: " + action.type);
    }
  }
}

export default function CombatTracker({ encounter }) {
  // STATE ---------------------------------------------------------------
  const [combatants, dispatch] = useReducer(combatantReducer, []);
  const [addCharactersOpen, setAddCharactersOpen] = useState(false);
  const [addMonstersOpen, setAddMonstersOpen] = useState(false);
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [roundCtr, setRoundCtr] = useState(1);
  const [combatActive, setCombatActive] = useState(false);

  // DERIVED -------------------------------------------------------------
  const activeCombatantIndex =
    combatants && combatants.findIndex((monster) => monster.active === true);

  // HOOKS ---------------------------------------------------------------
  const [parent, enableAnimations] = useAutoAnimate();
  const activeCombatantRef = useRef(null);

  // SIDE EFFECTS --------------------------------------------------------
  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      const localCombatants = JSON.parse(localStorage.getItem("combatants"));
      const localRoundCtr = JSON.parse(localStorage.getItem("roundCtr"));
      const localCombatActive = JSON.parse(
        localStorage.getItem("combatActive") === true
      );
      setRoundCtr(localRoundCtr);

      dispatch({ type: "fetched_combatants", combatants: localCombatants });
    }
    //     console.log(typeof window, window.localStorage);
    //     let storedCharacters = JSON.parse(
    //       window.localStorage.getItem("characters")
    //     );
    //     let storedMonsters = JSON.parse(localStorage.getItem("activeMonsters"));
    //     let storedRoundCtr = JSON.parse(window.localStorage.getItem("roundCtr"));
    //     let storedCombatActive = JSON.parse(
    //       localStorage.getItem("combatActive") === true
    //     );

    //     setActiveMonsters(storedMonsters);
    //     // setCharacters(storedCharacters);
    //     // setRoundCtr(storedRoundCtr);
    //     // setCombatActive(storedCombatActive);
    //   }
  }, []);

  useEffect(() => {
    let intervalId;
    if (isRunning) {
      intervalId = setInterval(() => setTime((t) => t + 1), 1000);
    }
    return () => clearInterval(intervalId);
  }, [isRunning]);

  useEffect(() => {
    // Scroll the active monster into view
    if (activeCombatantRef.current) {
      activeCombatantRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [activeCombatantIndex]);

  // https://github.com/vercel/next.js/discussions/49131#discussioncomment-6365650
  // https://articles.wesionary.team/using-localstorage-with-next-js-a-beginners-guide-7fc4f8bfd9dc
  // https://nextjs.org/docs/messages/react-hydration-error

  // useEffect(() => {
  //   if (typeof window !== "undefined" && window.localStorage) {
  //     localStorage.setItem("activeMonsters", JSON.stringify(activeMonsters));
  //     // localStorage.setItem("combatActive", JSON.stringify(combatActive));
  //     // localStorage.setItem("characters", JSON.stringify(characters));
  //   }
  //   // setActiveMonsters(activeMonsters);
  //   // console.log("saving...", window.localStorage);
  // }, [localActiveMonsters, activeMonsters]);

  // useEffect(() => {
  //   console.log("mount");
  //   if (typeof window !== "undefined" && window.localStorage) {
  //     console.log(typeof window, window.localStorage);
  //     let storedCharacters = JSON.parse(
  //       window.localStorage.getItem("characters")
  //     );
  //     let storedMonsters = JSON.parse(localStorage.getItem("activeMonsters"));
  //     let storedRoundCtr = JSON.parse(window.localStorage.getItem("roundCtr"));
  //     let storedCombatActive = JSON.parse(
  //       localStorage.getItem("combatActive") === true
  //     );

  //     setLocalActiveMonsters(storedMonsters);
  //     // setCharacters(storedCharacters);
  //     // setRoundCtr(storedRoundCtr);
  //     // setCombatActive(storedCombatActive);

  //     // console.log(activeMonsters);
  //   }
  // }, []);

  // EVENT HANDLERS ------------------------------------------------------
  // These are sent down to child components as props
  // ---------------------------------------------------------------------
  function handleSave() {
    console.log(window.localStorage);
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.setItem("activeMonsters", JSON.stringify(activeMonsters));
      localStorage.setItem("roundCtr", JSON.stringify(roundCtr));
    }
  }

  function getData() {
    console.log(JSON.parse(window.localStorage.getItem("activeMonsters")));
    if (typeof window !== "undefined" && window.localStorage) {
      let mon = JSON.parse(localStorage.getItem("activeMonsters"));
      setActiveMonsters(mon);
    }
  }

  function toggleCombat() {
    if (combatActive) {
      setCombatActive(false);
    } else {
      setCombatActive(true);
    }

    const sortedMonsters = activeMonsters
      .slice()
      .sort((a, b) => b.init - a.init);
    console.log(sortedMonsters);
    // Mark the monster with the highest "init" value as active
    const updatedMonsters = sortedMonsters.map((monster, index) => ({
      ...monster,
      active: index === 0, // Set the first monster as active
    }));

    setActiveMonsters(updatedMonsters);
    // setCombatActive(true);
    // setActiveMonsterIndex(0); // Set the active monster index to 0
  }

  const CombatSwitch = () => {
    return (
      <Switch.Group>
        <div className="flex items-center">
          <Switch.Label className="mr-4">Initiative</Switch.Label>

          <Switch
            checked={combatActive}
            onChange={toggleCombat}
            // onChange={setCombatActive}
            className={classNames(
              combatActive ? "bg-indigo-600" : "bg-gray-200",
              "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
            )}
          >
            <span className="sr-only">Use setting</span>
            <span
              className={classNames(
                combatActive ? "translate-x-5" : "translate-x-0",
                "pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
              )}
            >
              <span
                className={classNames(
                  combatActive
                    ? "opacity-0 duration-100 ease-out"
                    : "opacity-100 duration-200 ease-in",
                  "absolute inset-0 flex h-full w-full items-center justify-center transition-opacity"
                )}
                aria-hidden="true"
              >
                <svg
                  className="h-3 w-3 text-gray-400"
                  fill="none"
                  viewBox="0 0 12 12"
                >
                  <path
                    d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span
                className={classNames(
                  combatActive
                    ? "opacity-100 duration-200 ease-in"
                    : "opacity-0 duration-100 ease-out",
                  "absolute inset-0 flex h-full w-full items-center justify-center transition-opacity"
                )}
                aria-hidden="true"
              >
                <svg
                  className="h-3 w-3 text-indigo-600"
                  fill="currentColor"
                  viewBox="0 0 12 12"
                >
                  <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                </svg>
              </span>
            </span>
          </Switch>
        </div>
      </Switch.Group>
    );
  };

  const ManageCharacters = () => {
    const [newCharName, setNewCharName] = useState("");
    const [newCharArmorClass, setNewCharArmorClass] = useState("");

    function handleAddCharacter() {
      setCharacters((prev) => [
        ...prev,
        {
          id: nanoid(),
          init: 0,
          active: false,
          name: newCharName,
          armorClass: newCharArmorClass,
          type: "character",
          conditions: {
            BLND: false,
            CHRM: false,
            DEAF: false,
            FRGHT: false,
            GRPL: false,
            INCAP: false,
            INVIS: false,
            PRLZ: false,
            PETR: false,
            POIS: false,
            PRNE: false,
            REST: false,
            STUN: false,
            UNCON: false,
          },
        },
      ]);
    }

    function handleUpdateCharacter(char, e, key) {
      const characterIndex = characters.findIndex((c) => c.id === char.id);
      // console.log(char, characterIndex, characters);
      if (characterIndex !== -1) {
        const updatedCharacters = [...characters];
        updatedCharacters[characterIndex] = {
          ...char,
          [key]: e.target.value,
        };
        setCharacters(updatedCharacters);
        // setCharacters((prevChars) => {
        //   [...prevChars, { ...char, [key]: e.target.value }];
        // });
      }
    }

    function removeCharacter(char) {
      const characterIndex = characters.findIndex((c) => c.id === char.id);
    }

    return (
      <Transition.Root
        show={manageCharactersOpen}
        as={Fragment}
        appear
      >
        <Dialog
          as="div"
          className="relative z-10"
          onClose={setManageCharactersOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-25 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 w-screen overflow-y-auto p-4 sm:p-6 md:p-20">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="mx-auto max-w-xl transform rounded-xl bg-white p-6 shadow-2xl ring-1 ring-black ring-opacity-5 transition-all text-black">
                <div>
                  <h2 className="text-gray-900">manage party</h2>

                  {characters.length > 0 ? (
                    <>
                      {characters.map((char, idx) => (
                        <div
                          key={idx}
                          className="flex gap-4"
                        >
                          <div className="rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
                            <label
                              htmlFor="name"
                              className="block text-xs font-medium text-gray-900"
                            >
                              Name
                            </label>
                            <input
                              type="text"
                              name="name"
                              id="name"
                              value={char.name}
                              onChange={(e) =>
                                handleUpdateCharacter(char, e, "name")
                              }
                              className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                              placeholder="Jane Smith"
                            />
                          </div>
                          <div className="rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
                            <label
                              htmlFor="name"
                              className="block text-xs font-medium text-gray-900"
                            >
                              Armor Class
                            </label>
                            <input
                              type="text"
                              name="name"
                              id="name"
                              value={char.armorClass}
                              onChange={(e) =>
                                handleUpdateCharacter(char, e, "armorClass")
                              }
                              className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                              placeholder="Jane Smith"
                            />
                          </div>
                          <button
                            onClick={() => {
                              setCharacters(
                                characters.filter((c) => c.id !== char.id)
                              );
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      ))}
                      <div className="flex gap-4">
                        <div className="rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
                          <label
                            htmlFor="name"
                            className="block text-xs font-medium text-gray-900"
                          >
                            Name
                          </label>
                          <input
                            type="text"
                            name="name"
                            id="name"
                            onChange={(e) => setNewCharName(e.target.value)}
                            className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                            placeholder="Jane Smith"
                          />
                        </div>
                        <div className="rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
                          <label
                            htmlFor="name"
                            className="block text-xs font-medium text-gray-900"
                          >
                            Armor Class
                          </label>
                          <input
                            type="text"
                            name="name"
                            id="name"
                            // value={char.armorClass}
                            onChange={(e) =>
                              setNewCharArmorClass(e.target.value)
                            }
                            className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                            placeholder="Jane Smith"
                          />
                        </div>
                        <button
                          onClick={handleAddCharacter}
                          className="text-black"
                        >
                          save
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="flex gap-4">
                      <div className="rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
                        <label
                          htmlFor="name"
                          className="block text-xs font-medium text-gray-900"
                        >
                          Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          onChange={(e) => setNewCharName(e.target.value)}
                          className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                          placeholder="Jane Smith"
                        />
                      </div>
                      <div className="rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
                        <label
                          htmlFor="name"
                          className="block text-xs font-medium text-gray-900"
                        >
                          Armor Class
                        </label>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          // value={char.armorClass}
                          onChange={(e) => setNewCharArmorClass(e.target.value)}
                          className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                          placeholder="Jane Smith"
                        />
                      </div>
                      <button
                        onClick={handleAddCharacter}
                        className="text-black"
                      >
                        save
                      </button>
                    </div>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    );
  };

  function handleAddMonsters(monsters) {
    setAddMonstersOpen(false);
    // map through the monsters array and add necessary fields to each combatant object
    const newCombatants = monsters.map((monster) => ({
      ...monster,
      maxHP: monster.hit_points,
      active: false,
      init: rollInitiative(monster.dexterity),
      id: nanoid(),
      type: "monster",
      qty: monster.qty,
      conditions: {
        BLND: false,
        CHRM: false,
        DEAF: false,
        FRGHT: false,
        GRPL: false,
        INCAP: false,
        INVIS: false,
        PRLZ: false,
        PETR: false,
        POIS: false,
        PRNE: false,
        REST: false,
        STUN: false,
        UNCON: false,
      },
    }));

    dispatch({ type: "added_combatants", newCombatants: newCombatants });
    toast.success("Monsters added to initiative");
  }

  function getUniqueMonsterName(baseName) {
    let newName = baseName;
    let count = 1;

    while (
      activeMonsters.some((activeMonster) => activeMonster.name === newName)
    ) {
      newName = `${baseName} ${count}`;
      count++;
    }

    return newName;
  }

  // REFACTOR
  function handleKill(monster) {
    // console.log(monster);
    // set monster hp to zero
    const monsterIndexToKill = activeMonsters.findIndex(
      (m) => m.id === monster.id
    );
    // console.log(monsterIndexToKill);
    if (monsterIndexToKill !== -1) {
      // Create a new array with the updated monster object
      const updatedMonsters = [...activeMonsters];
      updatedMonsters[monsterIndexToKill] = { ...monster, hit_points: 0 };

      // Update the state with the new array
      setActiveMonsters(updatedMonsters);
    }
  }

  function handleDeleteCombatant(monster) {
    dispatch({ type: "deleted_combatant", id: monster.id });
    toast.custom((t) => (
      <div
        aria-live="assertive"
        className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6"
      >
        <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
          <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
            <div className="p-4">
              <div className="flex items-center">
                <div className="flex w-0 flex-1 justify-between">
                  <p className="w-0 flex-1 text-sm font-medium text-gray-900">
                    {monster.name} removed from combat
                  </p>
                  <button
                    type="button"
                    onClick={() => undoDeleteCombatant(monster, t.id)}
                    className="ml-3 flex-shrink-0 rounded-md bg-white text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Undo
                  </button>
                </div>
                <div className="ml-4 flex flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => toast.remove(t.id)}
                    className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon
                      className="h-5 w-5"
                      aria-hidden="true"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ));
  }

  function undoDeleteCombatant(monster, toastId) {
    dispatch({ type: "undo_deleted_combatant", monster: monster });
    toast.remove(toastId);
  }

  function handleMonsterCondition(monster, condition) {
    dispatch({
      type: "updated_conditions",
      combatant: monster,
      condition: condition,
    });
  }

  function startCombat() {
    // console.log("combat starting");
    // const sortedMonsters = activeMonsters
    //   .slice()
    //   .sort((a, b) => b.init - a.init);
    // console.log(sortedMonsters);
    // // Mark the monster with the highest "init" value as active
    // const updatedMonsters = sortedMonsters.map((monster, index) => ({
    //   ...monster,
    //   active: index === 0, // Set the first monster as active
    // }));

    // setActiveMonsters(updatedMonsters);

    dispatch({ type: "start_combat" });
    setCombatActive(true);
    setTime(1);
    setIsRunning(true);
    // setActiveMonsterIndex(0); // Set the active monster index to 0

    // if this is the first time combat is active, set the first monster as active
    // if (activeMonsterIndex === -1) {
    //   setActiveMonsterIndex(0);
    //   setActiveMonsters((prev) => [
    //     ...prev,
    //     { ...prev[0], active: true },  // set the first monster as active
    //   ]);
    // } else {
    //   setActiveMonsters((prev) => [
    //     ...prev,
  }

  function stopCombat() {
    console.log("combat paused");
    // const updatedMonsters = activeMonsters.map((monster) => ({
    //   ...monster,
    //   active: false,
    // }));

    // setActiveMonsters(updatedMonsters);
    setCombatActive(false);
    // setTime(0);
    setIsRunning(false);
    // Optionally, you can reset the active monster index to -1 or another value.
    // setActiveMonsterIndex(-1);
  }

  function nextTurn() {
    // console.log(activeMonsterCardRef);
    // if (activeMonsterCardRef.current) {
    //   activeMonsterCardRef.current.scrollIntoView({
    //     behavior: "smooth",
    //     block: "end",
    //   });
    // }

    dispatch({ type: "next_turn" });

    // const activeIndex = activeMonsters.findIndex((monster) => monster.active);

    // if (activeIndex !== -1) {
    //   const updatedMonsters = [...activeMonsters]; // copy the activeMonster array so that we don't modify the original
    //   updatedMonsters[activeIndex].active = false; // mark the currently active monster as inactive

    //   const sortedMonsters = updatedMonsters
    //     .slice()
    //     .sort((a, b) => b.init - a.init);

    //   // find the index of the next monster that will be active.
    //   // If activeIndex is less than the length of sortedMonsters - 1, increment the index by 1.
    //   // Otherwise, if it's the last monster in the array, wrap around to the first monster (0 index)
    //   const nextActiveIndex =
    //     activeIndex < sortedMonsters.length - 1 ? activeIndex + 1 : 0;

    //   // Check if the next turn starts a new round
    //   if (nextActiveIndex === 0) {
    //     setRoundCtr(roundCtr + 1);
    //     // turnCounter = 1
    //   }

    //   sortedMonsters[nextActiveIndex].active = true;
    //   setActiveMonsters(sortedMonsters);
    // }
  }

  function prevTurn() {
    const activeIndex = activeMonsters.findIndex((monster) => monster.active);

    if (activeIndex !== -1) {
      const updatedMonsters = [...activeMonsters];
      updatedMonsters[activeIndex].active = false;

      const sortedMonsters = updatedMonsters
        .slice()
        .sort((a, b) => b.init - a.init);
      const previousActiveIndex =
        activeIndex > 0 ? activeIndex - 1 : sortedMonsters.length - 1;

      sortedMonsters[previousActiveIndex].active = true;

      setActiveMonsters(sortedMonsters);
    }
  }

  function handleMonsterInitChange(monster, newInit) {
    dispatch({
      type: "updated_combatant",
      monster: monster,
      key: "init",
      newValue: newInit,
    });
  }

  function handleCombatantUpdate(monster, key, newValue) {
    // const monsterIndex = activeMonsters.findIndex((m) => m.id === monster.id);
    // if (monsterIndex !== -1) {
    //   const updatedMonsters = [...activeMonsters];
    //   updatedMonsters[monsterIndex] = { ...monster, [keyToUpdate]: newValue };
    //   setActiveMonsters(updatedMonsters);
    // }

    dispatch({
      type: "updated_combatant",
      monster: monster,
      key: key,
      newValue: newValue,
    });
  }

  function handleRestartCombat() {
    // reset all monster hp, conditions
  }

  function handleClearInitiative() {
    // remove all combatants
    dispatch({ type: "clear_initiative" });
  }

  function handlePlayPause() {
    // if combatActive is true, set it to false and call stopCombat()
    // if combatActive is false, set it to true and call startCombat()
    if (combatActive) {
      stopCombat();
    } else {
      startCombat();
    }
  }

  return (
    <div className="bg-slate-800 shadow-xl rounded-lg col-span-6 row-span-6 m-5 flex flex-col items-center relative">
      {/* Modals */}
      <AddMonster
        open={addMonstersOpen}
        setOpen={setAddMonstersOpen}
        onAddMonsters={handleAddMonsters}
        encounter={encounter}
      />
      {/* <ManageCharacters /> */}

      {/* Header */}
      <div
        id="header"
        className="w-full flex justify-between items-center rounded-t-md bg-slate-700 px-3 py-2.5 text-sm uppercase text-slate-200"
      >
        <h1 className=" font-medium tracking-wide">combat tracker</h1>
        <div className="flex gap-4">
          <span>round {roundCtr}</span>
          <Stopwatch time={time} />
        </div>
        <Setup
          onAddMonsters={() => setAddMonstersOpen(true)}
          onAddCharacter={() => setAddCharactersOpen(true)}
          onClearInitiative={handleClearInitiative}
        />
      </div>

      {/* Body */}
      <div className=" overflow-y-auto h-full w-full p-3">
        <ul
          ref={parent}
          className="w-full flex  flex-col space-y-2 "
        >
          {combatants &&
            combatants.length > 0 &&
            combatants
              .sort((a, b) => b.init - a.init)
              .map((monster, index) => {
                return (
                  <li key={monster.id}>
                    <MonsterCard
                      monster={monster}
                      onKill={handleKill}
                      onDelete={handleDeleteCombatant}
                      onInitChange={handleMonsterInitChange}
                      onSetCondition={handleMonsterCondition}
                    />
                    {/* {monster.type === "monster" ? (
                  <MonsterCard
                    monster={monster}
                    onKill={handleKill}
                    onDelete={handleDeleteMonster}
                    onInitChange={handleMonsterInitChange}
                    onSetCondition={handleMonsterCondition}
                    onOpenHPPopover={setShowHPPopover}
                  />
                ) : (
                  <CharacterCard character={monster} />
                )} */}
                  </li>
                );
              })}
        </ul>

        {/* Empty State */}
        {!combatants ||
          (combatants.length === 0 && (
            <div className=" flex flex-col justify-center text-center h-full my-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mx-auto h-12 w-12 text-gray-400"
              >
                <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5" />
                <line
                  x1="13"
                  x2="19"
                  y1="19"
                  y2="13"
                />
                <line
                  x1="16"
                  x2="20"
                  y1="16"
                  y2="20"
                />
                <line
                  x1="19"
                  x2="21"
                  y1="21"
                  y2="19"
                />
                <polyline points="14.5 6.5 18 3 21 3 21 6 17.5 9.5" />
                <line
                  x1="5"
                  x2="9"
                  y1="14"
                  y2="18"
                />
                <line
                  x1="7"
                  x2="4"
                  y1="17"
                  y2="20"
                />
                <line
                  x1="3"
                  x2="5"
                  y1="19"
                  y2="21"
                />
              </svg>

              <h3 className="mt-2 text-sm font-semibold text-gray-900">
                No combatants
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating a new project.
              </p>
              <div className="mt-6">
                <Button
                  size="default"
                  variant="secondary"
                  className="ml-6"
                >
                  <PlusIcon
                    className="-ml-0.5 mr-1.5 h-5 w-5"
                    aria-hidden="true"
                  />
                  some ext
                </Button>
              </div>
            </div>
          ))}
      </div>

      {/* Footer */}
      <div className="flex w-full place-content-end border-t border-slate-500 p-4">
        <span className="isolate inline-flex rounded-md shadow-sm">
          <button
            type="button"
            onClick={prevTurn}
            className="relative inline-flex items-center rounded-l-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
          >
            {/* <ArrowPathIcon
                className="h-5 w-5"
                aria-hidden="true"
              /> */}
            <kbd className="mr-2 flex h-5 w-5 items-center justify-center rounded border bg-gray-50 text-xs font-mono">
              B
            </kbd>
            <SkipBack
              size={20}
              className="text-gray-600"
            />
          </button>
          <button
            type="button"
            onClick={handlePlayPause}
            className="relative -ml-px inline-flex items-center bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
          >
            {/* <PlayIcon
                className="h-5 w-5"
                aria-hidden="true"
              /> */}
            <kbd className="mr-2 flex h-5 w-5 items-center justify-center rounded border bg-gray-50 text-xs font-mono">
              P
            </kbd>
            {combatActive ? (
              <Pause
                size={20}
                className="text-gray-600"
              />
            ) : (
              <Play
                size={20}
                className="text-gray-600"
              />
            )}
          </button>
          <button
            type="button"
            onClick={nextTurn}
            className="relative -ml-px inline-flex items-center rounded-r-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
          >
            {/* <ForwardIcon
                className="h-5 w-5"
                aria-hidden="true"
              /> */}
            <kbd className="mr-2 flex h-5 w-5 items-center justify-center rounded border bg-gray-50 text-xs font-mono">
              F
            </kbd>
            <SkipForward
              size={20}
              className="text-gray-600"
            />
          </button>
        </span>
      </div>
    </div>
  );
}

const testCombatants = [
  {
    id: "1",
    name: "Goblin",
    dexterity: 14,
    armor_class: [
      {
        value: 15,
      },
    ],
    hit_points: 7,
    maxHP: 7,
    active: false,
    init: 10,
    type: "monster",
    qty: 1,
    id: nanoid(),
    conditions: {
      BLND: false,
      CHRM: false,
      DEAF: false,
      FRGHT: false,
      GRPL: false,
      INCAP: false,
      INVIS: false,
      PRLZ: false,
      PETR: false,
      POIS: false,
      PRNE: false,
      REST: false,
      STUN: false,
      UNCON: false,
    },
    damage_immunities: [],
    damage_resistances: [],
    damage_vulnerabilities: [],
    proficiencies: [
      {
        value: 2,
        proficiency: {
          index: "saving-throw-con",
        },
      },
    ],
  },
  {
    id: "2",
    name: "Orc",
    dexterity: 12,
    armor_class: [
      {
        value: 13,
      },
    ],
    maxHP: 7,
    active: false,
    init: 10,
    type: "monster",
    qty: 1,
    id: nanoid(),
    conditions: {
      BLND: false,
      CHRM: false,
      DEAF: false,
      FRGHT: false,
      GRPL: false,
      INCAP: false,
      INVIS: false,
      PRLZ: false,
      PETR: false,
      POIS: false,
      PRNE: false,
      REST: false,
      STUN: false,
      UNCON: false,
    },
    hit_points: 15,
    damage_immunities: [],
    damage_resistances: ["poison"],
    damage_vulnerabilities: [],
    proficiencies: [
      {
        value: 2,
        proficiency: {
          index: "saving-throw-con",
        },
      },
    ],
  },
  // Add more monsters as needed
];
