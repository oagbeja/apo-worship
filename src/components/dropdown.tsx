import { useState, useRef, useEffect } from "react";
import ColorPicker from "./color-picker";

const Dropdown = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className='relative inline-block text-left' ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(!open)}
        className='inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300'
      >
        <img
          src='https://i.pravatar.cc/40'
          alt='Profile'
          className='rounded-full'
        />
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div className='absolute right-0 z-10 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg'>
          <ul className='py-1 text-sm text-gray-700'>
            <li>Text Color</li>
            <li>
              Background Color
              {/* should come up as a modal */}
              <ColorPicker />
            </li>
            <li>Background Image</li>
            <li>Enable Camera</li>
            <li>
              <a href='#' className='block px-4 py-2 hover:bg-gray-100'>
                Settings
              </a>
            </li>
            <li>
              <hr className='my-1' />
            </li>
            <li>
              <a
                href='#'
                className='block px-4 py-2 text-red-500 hover:bg-gray-100'
              >
                Logout
              </a>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
