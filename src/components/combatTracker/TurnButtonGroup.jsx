import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ForwardIcon,
  BackwardIcon,
} from "@heroicons/react/24/outline";

export default function TurnButtonGroup({
  combatActive,
  onNextTurn,
  onPrevTurn,
}) {
  return (
    <span className="isolate inline-flex rounded-md shadow-sm">
      <button
        disabled={combatActive === false}
        onClick={onPrevTurn}
        type="button"
        className="relative inline-flex items-center rounded-l-md bg-white px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-300"
      >
        <span className="sr-only">Previous</span>
        <BackwardIcon
          className="h-5 w-5"
          aria-hidden="true"
        />
      </button>
      <button
        disabled={combatActive === false}
        onClick={onNextTurn}
        type="button"
        className="relative -ml-px inline-flex items-center rounded-r-md bg-white px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-300"
      >
        <span className="sr-only">Next</span>
        <ForwardIcon
          className="h-5 w-5"
          aria-hidden="true"
        />
      </button>
    </span>
  );
}
