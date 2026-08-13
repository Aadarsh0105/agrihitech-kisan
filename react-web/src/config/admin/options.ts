export const statusOptions = [
{ value: 'active', label: 'Active' },
{ value: 'inactive', label: 'Inactive' },
{ value: 'draft', label: 'Draft' },
{ value: 'archived', label: 'Archived' }];


export const availabilityOptions = [
{ value: 'in_stock', label: 'In stock' },
{ value: 'out_of_stock', label: 'Out of stock' },
{ value: 'on_request', label: 'On request' }];


export const dealerStatusOptions = [
{ value: 'approved', label: 'Approved' },
{ value: 'pending', label: 'Pending' },
{ value: 'rejected', label: 'Rejected' },
{ value: 'suspended', label: 'Suspended' }];


export const statusFilter = { key: 'status', label: 'Status', options: statusOptions };

export const yesNoOptions = [
{ value: 'yes', label: 'Yes' },
{ value: 'no', label: 'No' }];


export const newId = (prefix: string): string =>
`${prefix}_${Math.random().toString(36).slice(2, 8)}`;