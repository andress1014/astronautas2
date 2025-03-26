export type RegisterResponse = {
    message: string;
    user: {
      _id: string;
      email: string;
      fullName: string;
      createdAt: Date;
      updatedAt: Date;
      [key: string]: any; // por si agregas más campos en el futuro
    };
  }
  