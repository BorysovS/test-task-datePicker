import React, { useState, useRef, useEffect } from "react";

export const CustomSelect = ({ value, onChange, options }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (val) => {
    onChange(val);
    setOpen(false);
  };

  return (
    <div className="custom-select" ref={ref}>
      <div className="select-display" onClick={() => setOpen(!open)}>
        {value}
        <span className="arrow">{open ? "▲" : "▼"}</span>
      </div>

      {open && (
        <ul className="options-list">
          {options.map((opt) => (
            <li
              key={opt}
              className={`option-item ${opt === value ? "selected" : ""}`}
              onClick={() => handleSelect(opt)}
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
