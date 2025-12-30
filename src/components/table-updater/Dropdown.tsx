interface DropdownProps {
  options: { value: number; label: string }[];
  selectedValue: number;
  onChange: (value: number) => void;
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  selectedValue,
  onChange,
}) => {
  const handleOptionClick = (value: number) => {
    onChange(value);
  };

  return (
    <div className='flex justify-evenly mt-1 w-full bg-white rounded rounded-xs shadow-lg z-10'>
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => handleOptionClick(option.value)}
          className={`${selectedValue == option.value ? 'bg-gray-300' : 'bg-transparent'} rounded rounded-xs block w-full text-xs text-center p-2 focus:outline-none`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default Dropdown;
