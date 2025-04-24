export type department = {
  dept_id: number;
  dept_name: string;
  weekend: Weekdays[];
};

export type Weekdays =
  | "Saturday"
  | "Sunday"
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday";
