import { Edit, Trash2 } from "lucide-react";

interface IActionIcons {
  className?: string;
  concern?: string;
  rowid: number;
  triggerEdit?: (id: number) => void;
  triggerDelete?: (id: number) => void;
  display?: string[];
}
const ActionIcons: React.FC<IActionIcons> = ({
  className,
  concern,
  rowid,
  triggerEdit,
  triggerDelete,
  display = ["edit", "delete"],
}) => {
  return (
    <div className='flex gap-4'>
      {display.includes("edit") && (
        <Edit
          className={`w-3 h-3 text-blue-500 cursor-pointer hover:text-blue-700 ${className}`}
          onClick={() => triggerEdit && triggerEdit(rowid)}
        >
          <title>{`Edit ${concern ?? ""}`}</title>
        </Edit>
      )}
      {display.includes("delete") && (
        <Trash2
          className={`w-3 h-3 text-red-500 cursor-pointer hover:text-red-700 ${className}`}
          onClick={() => triggerDelete && triggerDelete(rowid)}
        >
          <title>{`Delete ${concern ?? ""}`}</title>
        </Trash2>
      )}
    </div>
  );
};

export default ActionIcons;
