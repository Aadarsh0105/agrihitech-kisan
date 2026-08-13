import React from 'react';
import { MoreHorizontalIcon, PencilIcon, Trash2Icon, EyeIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { Dropdown, DropdownItem, DropdownSeparator } from '../ui/Dropdown';

export interface RowAction {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
}

export function RowActions({
  onView,
  onEdit,
  onDelete,
  extra = []





}: {onView?: () => void;onEdit?: () => void;onDelete?: () => void;extra?: RowAction[];}) {
  return (
    <Dropdown
      trigger={({ toggle }) =>
      <Button variant="ghost" size="iconSm" aria-label="Row actions" onClick={toggle}>
          <MoreHorizontalIcon className="h-4 w-4" />
        </Button>
      }>
      
      {({ close }) =>
      <>
          {onView ?
        <DropdownItem
          onClick={() => {
            onView();
            close();
          }}>
          
              <EyeIcon className="h-3.5 w-3.5" />
              View
            </DropdownItem> :
        null}
          {onEdit ?
        <DropdownItem
          onClick={() => {
            onEdit();
            close();
          }}>
          
              <PencilIcon className="h-3.5 w-3.5" />
              Edit
            </DropdownItem> :
        null}
          {extra.map((action) =>
        <DropdownItem
          key={action.label}
          danger={action.danger}
          onClick={() => {
            action.onClick();
            close();
          }}>
          
              {action.icon}
              {action.label}
            </DropdownItem>
        )}
          {onDelete ?
        <>
              <DropdownSeparator />
              <DropdownItem
            danger
            onClick={() => {
              onDelete();
              close();
            }}>
            
                <Trash2Icon className="h-3.5 w-3.5" />
                Delete
              </DropdownItem>
            </> :
        null}
        </>
      }
    </Dropdown>);

}