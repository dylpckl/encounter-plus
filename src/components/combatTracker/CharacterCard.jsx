"use client";

import { useState, forwardRef } from "react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const CONDITIONS = [
  "BLND",
  "CHRM",
  "DEAF",
  "FRGHT",
  "GRPL",
  "INCAP",
  "INVIS",
  "PRLZ",
  "PETR",
  "POIS",
  "PRNE",
  "REST",
  "STUN",
  "UNCON",
];

const CharacterCard = forwardRef(({ character }, ref) => {
  const [conditionsOpen, setConditionsOpen] = useState(false);
  const ConditionsButton = () => {
    const numberOfActiveConditions = Object.values(character.conditions).reduce(
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

  return (
    <div
      ref={ref}
      className={classNames(
        character.active ? "bg-red-300" : "bg-slate-500",
        "static backdrop-blur-md rounded-lg p-3 flex flex-col items-center justify-between"
      )}
    >
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

          <button onClick={() => onDelete(character)}>
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

      <div>
        {conditionsOpen && (
          <ul className="flex gap-1 flex-wrap mt-2">
            {CONDITIONS.sort().map((cond) => (
              <li key={cond}>
                <button
                  onClick={() => onSetCondition(character, cond)}
                  className={classNames(
                    character.conditions[cond]
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
              onClick={() => onSetCondition(character, "CLEAR")}
            >
              clear
            </button>
          </ul>
        )}
      </div>
    </div>
  );
});

export default CharacterCard;
