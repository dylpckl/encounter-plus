"use client";
import { useEffect, useState } from "react";

export default function useDebounce<T>(value: T, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  // the effect is here the whole time, when value changes the effect re-runs again, which creates a new timeout instance and kills the old one
  // query = a, timeout waiting 500ms to return debouncedValue = a
  // query = ac, kill the old timeout and make a new one waiting 500ms to return debouncedValue = ac

  // after the delay, set debouncedValue to value
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    // when this hook unmounts, taken off the dom
    // a waits for 500ms before being returned
    // i type "ac" before 500ms happens, so this hook gets replaced by a new instance with "ac"
    return () => {
      clearTimeout(timeout);
    };
  }, [value, delay]);

  return debouncedValue;
}
