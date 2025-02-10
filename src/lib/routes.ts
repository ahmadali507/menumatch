
export const routes = {
  addRestaurant: "/restaurants/add",
  login: "/auth/login",
} as const

export const defaultRoutes = {
  super_admin: "/",
  admin: "/restaurant",
  user: "/user",
}


export const routesAccessRegex = {
  super_admin: ["/", "/admins/*", "/restaurants/*"],
  admin: ["/restaurant/*"],
  user: ["/user/*"]
}