import React from "react";

interface IInput extends React.InputHTMLAttributes<HTMLInputElement> {}

const CInput = ({ className = "", ...rest }: IInput) => {
  return (
    <input
      {...rest}
      className={`block w-full rounded-md border border-gray-300 px-3 py-2
        placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500
        focus:outline-none transition ${className}`}
    />
  );
};

export default CInput;
