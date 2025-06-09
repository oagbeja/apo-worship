import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { Check, ChevronDown } from "lucide-react";
import {
  // useEffect,
  useState,
} from "react";

export interface IOptions {
  id: number | string;
  title: string;
}

export default function SelectInput({
  options,
  handleChange,
  selected,
  setSelected,
  bodyClass,
  setQueryExternal,
}: {
  options: IOptions[];
  handleChange: Function;
  selected: IOptions;
  setSelected: Function;
  setQueryExternal?: Function;
  bodyClass?: string;
}) {
  // const [selected, setSelected] = useState<IOptions>();
  const [query, setQuery] = useState("");

  console.log({ selected });

  const filteredoptions =
    query === ""
      ? options
      : options.filter((option) =>
          option.title.toLowerCase().includes(query.toLowerCase())
        );

  const handleChangeFn = (value: IOptions) => {
    setSelected(value);
    handleChange(value.id);
  };

  // useEffect(() => {
  //   if (options?.[0] && !selected) {
  //     setSelected(options[0]);
  //   }
  // }, [options]);

  return (
    <div className={` ${bodyClass ?? " w-72"}`}>
      <Combobox
        value={selected}
        onChange={(value: IOptions) => handleChangeFn(value)}
      >
        <div className='relative'>
          <div className='relative w-full cursor-default overflow-hidden rounded-lg border border-gray-300 bg-white text-left shadow-md focus-within:ring-2 focus-within:ring-blue-500'>
            <ComboboxInput
              className='w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:outline-none'
              displayValue={(option: typeof selected) => option?.title ?? ""}
              onChange={(e) => {
                setQuery(e.target.value);
                setQueryExternal && setQueryExternal(e.target.value);
              }}
              placeholder='Search option...'
            />
            <ComboboxButton className='absolute inset-y-0 right-0 flex items-center pr-1 cursor-pointer'>
              <ChevronDown className='h-4 w-4 text-gray-400' />
            </ComboboxButton>
          </div>

          {filteredoptions.length > 0 && (
            <ComboboxOptions className='absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white py-1 text-base shadow-lg focus:outline-none'>
              {filteredoptions.map((option) => (
                <ComboboxOption
                  key={option.id}
                  value={option}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2 pl-7 pr-4 ${
                      active ? "bg-blue-100 text-blue-900" : "text-gray-900"
                    }`
                  }
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        {option.title}
                      </span>
                      {selected && (
                        <span className='absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600'>
                          <Check className='h-4 w-4' />
                        </span>
                      )}
                    </>
                  )}
                </ComboboxOption>
              ))}
            </ComboboxOptions>
          )}

          {query !== "" && filteredoptions.length === 0 && (
            <div className='absolute z-10 mt-1 w-full rounded-md bg-white py-2 px-4 text-sm text-gray-500 shadow-lg'>
              No options found.
            </div>
          )}
        </div>
      </Combobox>
    </div>
  );
}
