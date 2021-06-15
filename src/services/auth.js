export const getToken = () => localStorage.getItem('token');

export const requireAuthentication = (to, from, next) => {
  if (!getToken()) return next({ name: 'Login' });

  return next();
};
