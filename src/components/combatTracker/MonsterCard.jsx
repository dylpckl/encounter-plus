"use client";

// TODO ===================================================
// handle init change, disallow non-numbers
// HP
//    convert to button with standard width
//    design popover
// show first 3 active conditions in footer
// structure: footer
// turn timer
//
//

import { useState, useEffect, forwardRef, useRef, Fragment } from "react";
import { CONDITIONS } from "@/lib/constants";
import { Transition } from "@headlessui/react";
import { ClockIcon, HeartIcon } from "@heroicons/react/24/outline";

import { Popover } from "@headlessui/react";

import useDebounce from "@/lib/hooks/useDebounce";
import useOnClickOutside from "@/lib/hooks/useOnClickOutside";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const HitPointPopover = () => {
  return (
    <div className="absolute -right-1 bg-red-300">
      aaaaaaaaaaaaaaaaaaaaaaaaa
    </div>
  );
};

const MonsterCard = forwardRef(
  (
    {
      monster,
      onInitChange,
      onKill,
      onDelete,
      onSetCondition,
      onOpenHPPopover,
    },
    ref
  ) => {
    const [currHP, setCurrHP] = useState(monster.hit_points);
    const [inputValue, setInputValue] = useState(monster.init);
    const [conditionsOpen, setConditionsOpen] = useState(false);

    const popoverRef = useRef(null);

    const [popoverOpen, setPopoverOpen] = useState(false);

    const [newInit, setNewInit] = useState(monster.init);

    const debouncedInit = useDebounce(newInit);

    useOnClickOutside(popoverRef, () => setPopoverOpen(false));

    const ConditionsButton = () => {
      const numberOfActiveConditions = Object.values(monster.conditions).reduce(
        (a, item) => a + item,
        0
      );

      return (
        <button
          onClick={() => setConditionsOpen(!conditionsOpen)}
          className="flex items-center gap-2 px-2 py-1 rounded-md text-xs bg-slate-400 hover:bg-slate-700"
        >
          Conditions
          <span>{numberOfActiveConditions}</span>
          {conditionsOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 15.75l7.5-7.5 7.5 7.5"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
              />
            </svg>
          )}
        </button>
      );
    };

    const handleInputChange = (event) => {
      // Allow only numbers
      const value = event.target.value.replace(/[^0-9]/g, "");
      setInputValue(value);
    };

    const handleInputKeyDown = (event) => {
      // Allow only numbers and specific keys
      if (
        !(
          event.key === "Enter" ||
          event.key === "Backspace" ||
          event.key === "ArrowLeft" ||
          event.key === "ArrowRight" ||
          event.key === "Tab"
        )
      ) {
        if (isNaN(parseInt(event.key, 10))) {
          event.preventDefault();
        }
      }
    };

    useEffect(() => {
      onInitChange(monster, debouncedInit);
    }, [debouncedInit]);

    function handleInitChange(monster, e) {
      setNewInit(parseInt(e.target.value, 10));
    }

    return (
      <>
        {popoverOpen && (
          <Transition
            as={Fragment}
            show={popoverOpen}
            appear
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <div
              ref={popoverRef}
              className="absolute w-12 h-12 -right-20 z-50 bg-sky-300"
            >
              aaaaaaaaa
            </div>
          </Transition>
        )}

        <div
          ref={ref}
          className={classNames(
            monster.active ? "bg-red-300" : "bg-slate-500",
            "relative backdrop-blur-md rounded-lg p-3 flex flex-col items-center justify-between"
          )}
        >
          {/* <Popover className="relative">
            <Popover.Button>Solutions</Popover.Button>
            <Transition
              enter="transition duration-100 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-75 ease-out"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
            >
              <Popover.Panel className="bg-white text-black absolute z-50">
                <div className="grid grid-cols-2">
                  <a href="/analytics">Analytics</a>
                  <a href="/engagement">Engagement</a>
                  <a href="/security">Security</a>
                  <a href="/integrations">Integrations</a>
                </div>
              </Popover.Panel>
            </Transition>
          </Popover> */}
          <div className="flex w-full gap-4">
            <div className="flex relative rounded-md shadow-sm">
              <div className="pointer-events-none absolute h-10 inset-y-0 left-0 flex items-center pl-3">
                <ClockIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </div>
              <input
                // id="init"
                // // onChange={(e) => onInitChange(monster, e)}
                // onChange={(e) => handleInitChange(monster, e)}
                // onClick={(e) => e.target.select()}
                // className="block w-20 h-10 text-center rounded-md border-0 pl-10 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                // type="text"
                // value={monster.init}
                id="init"
                onChange={(e) => {
                  handleInputChange(e);
                  handleInitChange(monster, e);
                }}
                onFocus={(e) => e.target.select()}
                onKeyDown={handleInputKeyDown}
                className="block w-20 h-10 text-center rounded-md border-0 pl-10 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                type="text"
                value={inputValue}
              />
            </div>

            {/* Details */}
            <div className="flex flex-col w-full">
              <h2
                className={classNames(
                  monster.hit_points === 0 && "line-through"
                )}
              >
                {monster.name}
              </h2>

              <ul className="flex flex-wrap gap-x-2 text-xs">
                <span className="text-slate-300">AC</span>{" "}
                {monster.armor_class[0].value}
                {monster.proficiencies.map((prof, index) => {
                  let profName = prof.proficiency.index;
                  return (
                    profName.includes("saving-throw") && (
                      <li
                        key={index}
                        className="text-xs"
                      >
                        <span className="uppercase text-slate-300">
                          {profName.slice(-3)}
                        </span>
                        {" +"}
                        {prof.value}
                      </li>
                    )
                  );
                })}
              </ul>
            </div>

            {/* HP */}
            <div className="">
              <div className="flex items-center gap-2">
                <div className=" flex items-center relative rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 top-0 left-0 flex items-center pl-3">
                    <HeartIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </div>
                  <input
                    id="hp"
                    onClick={() => setPopoverOpen(true)}
                    className="block w-20 h-10 text-center rounded-md border-0 py-1.5 pl-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    type="text"
                    // placeholder={currHP}
                    // value={currHP}
                    value={monster.hit_points}
                    onChange={handleInputChange}
                    onKeyDown={handleInputKeyDown}
                  />
                </div>

                {"/"}
                <span>{monster.maxHP}</span>
              </div>
            </div>
          </div>

          {/* Conditions */}
          <div className="w-full flex justify-between items-center mt-2">
            <ConditionsButton />

            <div className="flex items-center">
              <button onClick={() => onKill(monster)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  className="mr-2 w-5 h-5 fill-slate-400 hover:fill-red-400"
                >
                  <path d="M368 400c-.4-16 7.3-31.2 20.4-40.4C436.1 326.2 464 276.9 464 224c0-91.4-86.9-176-208-176S48 132.6 48 224c0 52.9 27.9 102.2 75.6 135.6c13.1 9.2 20.8 24.4 20.4 40.4l0 0v64h48V440c0-13.3 10.7-24 24-24s24 10.7 24 24v24h32V440c0-13.3 10.7-24 24-24s24 10.7 24 24v24h48V400l0 0zm48-1.1c0 .4 0 .7 0 1.1v64c0 26.5-21.5 48-48 48H144c-26.5 0-48-21.5-48-48V400c0-.4 0-.7 0-1.1C37.5 357.8 0 294.7 0 224C0 100.3 114.6 0 256 0S512 100.3 512 224c0 70.7-37.5 133.8-96 174.9zM112 256a56 56 0 1 1 112 0 56 56 0 1 1 -112 0zm232-56a56 56 0 1 1 0 112 56 56 0 1 1 0-112z" />
                </svg>
              </button>

              <button onClick={() => onDelete(monster)}>
                <svg
                  className="w-5 h-5 fill-slate-400 hover:fill-black"
                  xmlns="http://www.w3.org/2000/svg"
                  height="1em"
                  viewBox="0 0 448 512"
                >
                  <path d="M170.5 51.6L151.5 80h145l-19-28.4c-1.5-2.2-4-3.6-6.7-3.6H177.1c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6L354.2 80H368h48 8c13.3 0 24 10.7 24 24s-10.7 24-24 24h-8V432c0 44.2-35.8 80-80 80H112c-44.2 0-80-35.8-80-80V128H24c-13.3 0-24-10.7-24-24S10.7 80 24 80h8H80 93.8l36.7-55.1C140.9 9.4 158.4 0 177.1 0h93.7c18.7 0 36.2 9.4 46.6 24.9zM80 128V432c0 17.7 14.3 32 32 32H336c17.7 0 32-14.3 32-32V128H80zm80 64V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16z" />
                </svg>
              </button>
            </div>
          </div>

          <Transition
            appear={true}
            unmount={false}
            show={conditionsOpen}
            enter="transition ease-in-out duration-200 transform"
            enterFrom="opacity-0 -translate-y-full"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in-out duration-200 transform"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 -translate-y-full"
          >
            {conditionsOpen && (
              <ul className="flex gap-1 flex-wrap mt-2">
                {CONDITIONS.sort().map((cond) => (
                  <li key={cond}>
                    <button
                      onClick={() => onSetCondition(monster, cond)}
                      className={classNames(
                        monster.conditions[cond]
                          ? "text-sky-200 border-sky-200"
                          : "",
                        "border border-slate-100 px-2 py-1 rounded-md text-xs hover:bg-slate-700"
                      )}
                    >
                      {cond}
                    </button>
                  </li>
                ))}
                <button
                  className="border border-slate-100 px-2 py-1 rounded-md text-xs hover:bg-slate-700 uppercase"
                  onClick={() => onSetCondition(monster, "CLEAR")}
                >
                  clear
                </button>
              </ul>
            )}
          </Transition>
        </div>
      </>
    );
  }
);

export default MonsterCard;
