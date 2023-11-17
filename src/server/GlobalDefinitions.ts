export interface Hardware {
  id: number,
  name: string,
  location: string,
  hashRate: string,
};

export interface User {
  username: string;
  passwordHash: string;
}
