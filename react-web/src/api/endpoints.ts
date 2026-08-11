const ENDPOINTS = {
  HOME: "/home/user",

  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    PROFILE: "/auth/profile",
  },

  PRODUCT: {
    LIST: "/product/user",
    DETAILS: (id: string) => `/product/user/${id}`,
  },

  CATEGORY: {
    LIST: "/category/user",
    DETAILS: (id: string) => `/category/user/${id}`,
  },

  BRAND: {
    LIST: "/brand/user",
    DETAILS: (id: string) => `/brand/user/${id}`,
  },

  NEWS: {
    LIST: "/news/user",
  },
};

export default ENDPOINTS;