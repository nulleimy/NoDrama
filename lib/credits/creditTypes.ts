export type CreditAccount = {
  userId: string;
  credits: number;
  updatedAt: string;
  createdAt: string;
};

export type CreditStatus = {
  userId: string;
  credits: number;
  hasCredits: boolean;
};
