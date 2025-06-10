interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  component?: React.ReactNode;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  component,
  className,
}) => {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-white/10 backdrop-blur-sm flex items-center justify-center z-50'>
      <div
        className={`bg-white rounded-lg shadow-lg w-96 p-6 relative ${className}`}
      >
        {/*
        <h2 className='text-xl font-semibold text-black mb-4'>Modal Title</h2>
         <p className=' text-black mb-4'>
          This is a simple modal using Tailwind CSS in React.
        </p>
        <div className='flex justify-end space-x-2'>
          <button
            onClick={onClose}
            className='bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 cursor-pointer'
          >
            Cancel
          </button>
          <button className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer'>
            Confirm
          </button>
        </div> */}
        {component}
        <button
          onClick={onClose}
          className='absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl cursor-pointer'
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default Modal;
