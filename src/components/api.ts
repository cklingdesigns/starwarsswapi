export const fakeUser = {
  username: "starwarsfan",
  password: "password",
};

export const generateFakeToken = (expSeconds = 60) => {
  const payload = {
    exp: Math.floor(Date.now() / 1000) + expSeconds,
  };
  return btoa(JSON.stringify(payload)); // Base64-encoded "JWT"
};

export const loginApi = async (username: string, password: string) => {
  if (username === fakeUser.username && password === fakeUser.password) {
    return {
      accessToken: generateFakeToken(60), // 1 min
      refreshToken: generateFakeToken(300), // 5 mins
    };
  } else {
    throw new Error("Invalid credentials");
  }
};

export const refreshTokenApi = async (refreshToken: string) => {
  // Assume refreshToken is valid
  return {
    accessToken: generateFakeToken(60),
  };
};

export const decodeToken = (token: string): { exp: number } => {
  return JSON.parse(atob(token));
};
