export const usernameRegex = /^[A-Za-z0-9]+(?:[_-][A-Za-z0-9]+)*$/;

export const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

export const jwtRegex = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/;
