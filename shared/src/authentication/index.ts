export type AuthenticatedPrincipal = {
  userId: string;
  email?: string;
  roles: string[];
};
