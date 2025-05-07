import React, { useState, useRef, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";

import { CustomSelect } from "./CustomSelect/CustomSelect";

import "react-day-picker/dist/style.css";

const generateTimeOptions = () => {
  const options = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      options.push(
        `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`
      );
    }
  }
  return options;
};

const timeOptions = generateTimeOptions();

export const DateSelector = () => {
  const [selectedRange, setSelectedRange] = useState({
    from: undefined,
    to: undefined,
  });
  const [step, setStep] = useState(null);
  const [startTime, setStartTime] = useState("12:00");
  const [endTime, setEndTime] = useState("12:00");
  const [showCalendar, setShowCalendar] = useState(false);
  const endDateBtnRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (range) => {
    setSelectedRange(range);

    if (range.from && !range.to) {
      setStep("to");
      setTimeout(() => endDateBtnRef.current?.focus(), 0);
    }

    if (range.from && range.to) {
      setStep("done");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    alert(
      `Start: ${selectedRange.from ? format(selectedRange.from, "PPP") : "—"} ${
        startTime || ""
      }\nEnd: ${selectedRange.to ? format(selectedRange.to, "PPP") : "—"} ${
        endTime || ""
      }`
    );
  };

  return (
    <form
      className="date-time-wrapper"
      onSubmit={handleSubmit}
      ref={wrapperRef}
    >
      <div className="header-buttons">
        <button
          type="button"
          onClick={() => {
            setStep("from");
            setShowCalendar(true);
            setSelectedRange({ from: undefined, to: undefined });
          }}
          className={step === "from" ? "active" : ""}
        >
          {selectedRange.from
            ? `Start: ${format(selectedRange.from, "PPP")}`
            : "Start Date"}
        </button>

        <button
          type="button"
          ref={endDateBtnRef}
          onClick={() => {
            if (selectedRange.from) {
              setStep("to");
              setShowCalendar(true);
            }
          }}
          className={step === "to" ? "active" : ""}
        >
          {selectedRange.to
            ? `End: ${format(selectedRange.to, "PPP")}`
            : "End Date"}
        </button>
      </div>

      {showCalendar && (
        <div className="calendar">
          <DayPicker
            mode="range"
            selected={selectedRange}
            onSelect={handleSelect}
            numberOfMonths={2}
            pagedNavigation
          />
        </div>
      )}

      <div className="time-pickers">
        <div className="field">
          <label>Start Time (optional)</label>
          <CustomSelect
            value={startTime}
            onChange={setStartTime}
            options={timeOptions}
          />
        </div>

        <div className="field">
          <label>End Time (optional)</label>
          <CustomSelect
            value={endTime}
            onChange={setEndTime}
            options={timeOptions}
          />
        </div>
      </div>

      <div className="summary">
        <p>
          <strong>Selected range:</strong>
        </p>

        <p>
          Start: {selectedRange.from ? format(selectedRange.from, "PPP") : "—"}{" "}
          {startTime ? `at ${startTime}` : ""}
        </p>

        <p>
          End: {selectedRange.to ? format(selectedRange.to, "PPP") : "—"}{" "}
          {endTime ? `at ${endTime}` : ""}
        </p>
      </div>

      <button type="submit" className="search-button">
        Search
      </button>
    </form>
  );
};
