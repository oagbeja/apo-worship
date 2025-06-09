import { Button } from "@headlessui/react";

interface IButton extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
}

const CButton = ({ title, disabled, className, ...rest }: IButton) => {
  return (
    <Button
      disabled={disabled}
      {...rest}
      className={`font-semibold py-2 px-4 rounded transition 
        ${
          disabled
            ? "bg-gray-400 text-white cursor-not-allowed"
            : "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
        } ${className}`}
    >
      {title}
    </Button>
  );
};

export default CButton;
