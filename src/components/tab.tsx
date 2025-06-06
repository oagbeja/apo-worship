import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import type { ReactNode } from "react";

interface ITab {
  title: string;
  component: ReactNode;
}

interface ITabs {
  items: ITab[];
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Tabs({ items }: ITabs) {
  return (
    <TabGroup className='h-full overflow-hidden '>
      <TabList className='flex space-x-1 rounded-xl bg-blue-900/20 p-1 w-[50%] h-[50px]'>
        {items.map((item) => (
          <Tab
            key={item.title}
            className={({ selected }) =>
              classNames(
                "w-full rounded-lg py-2.5 text-sm font-medium leading-5 cursor-pointer",
                selected
                  ? "bg-white text-blue-700 shadow"
                  : "text-blue-100 hover:bg-white/[0.12] hover:text-white"
              )
            }
          >
            {item.title}
          </Tab>
        ))}
      </TabList>
      <TabPanels className='h-[calc(100%-55px)] overflow-hidden'>
        {items.map((item, idx) => (
          <TabPanel key={`TabP${idx}`} className='p-3 h-full'>
            {item.component}
          </TabPanel>
        ))}
      </TabPanels>
    </TabGroup>
  );
}
