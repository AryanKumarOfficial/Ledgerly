export interface Login {
  email: string;
  password: string;
}

export interface Register {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface Reset {
  token: string;
  uid: string;
  newPassword: string;
}
