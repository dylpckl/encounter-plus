import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ForwardIcon,
  BackwardIcon,
} from "@heroicons/react/24/outline";

export default function Example() {
  return (
    <span className="isolate inline-flex rounded-md shadow-sm">
      <button
        type="button"
        className="relative inline-flex items-center rounded-l-md bg-white px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
      >
        <span className="sr-only">Previous</span>
        <BackwardIcon
          className="h-5 w-5"
          aria-hidden="true"
        />
      </button>
      <button
        type="button"
        className="relative -ml-px inline-flex items-center rounded-r-md bg-white px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
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
