export const createPageUrl = (pageName: string) => {
  return pageName === "Home" ? "/" : `/${pageName.toLowerCase()}`;
};
