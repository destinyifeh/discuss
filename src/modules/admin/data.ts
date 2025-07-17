// Suspension period options
export const suspensionPeriodsData = [
  {value: '1', label: '1 day'},
  {value: '3', label: '3 days'},
  {value: '7', label: '7 days'},
  {value: '14', label: '14 days'},
  {value: '21', label: '21 days'},
  {value: '30', label: '30 days'},
];

export const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#8884d8',
  '#82ca9d',
];

export const actionPlaceholders: Record<string, string> = {
  suspend: 'suspension',
  unsuspend: 'unsuspension',
  unban: 'unban',
  ban: 'ban',
};

export const actionDescriptions: Record<string, string> = {
  view: 'View user profile information',
  suspend: 'Temporarily suspend this user account',
  unsuspend: 'Unsuspend this user account',
  unban: 'Unban this user account',
  ban: 'Permanently ban this user from the platform',
};

export const actionTitles: Record<string, string> = {
  view: 'User Details',
  suspend: 'Suspend User',
  unsuspend: 'Unsuspend User',
  unban: 'Unban User',
  ban: 'Ban User',
};
