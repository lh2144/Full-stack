import { UserNamePasswordInput } from "src/resolvers/user";

export const validateRegister = (options: UserNamePasswordInput) => {
//   if (!options?.email.includes("@")) {
//     return [
//       {
//         field: "email",
//         message: "invalid email",
//       },
//     ];
//   }

  if (options.userName.length <= 2) {
    return [
      {
        field: "username",
        message: "length must be greater than 2",
      },
    ];
  }

  if (options.userName.includes("@")) {
    return [
      {
        field: "username",
        message: "cannot include an @",
      },
    ];
  }

  if (options.password.length <= 2) {
    return [
      {
        field: "password",
        message: "length must be greater than 2",
      },
    ];
  }

  return null;
};