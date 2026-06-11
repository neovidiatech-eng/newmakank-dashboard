export const routes = {
  dashboard: "/dashboard",
  plans: "/plans",
  users: "/users",
  jockeyUsers: "/users?type=JOCKEY",
  premiumUsers: "/premium-users",
  editProfile: "/edit-profile",
  category: "/category",
  purchase: "/purchase",
  horse: "/horse",
  color: "/color",
  season: "/season",
  track: "/track",
  raceType: "/race-type",
  fortification: "/fortification",
  race: "/race",
  heat: "/heat",
  raceFortification: "/race-fortification",
  transportMovement: "/transportmovement",
  training: "/training",
  trainingType: "/trainingtype",
  block: "/block",
  conditions: "/conditions",
  usersWithType: (type: string): string => `/users?type=${type}`
};

// type Routes = Record<routesKey, string>;

export type routesKey = keyof typeof routes;
