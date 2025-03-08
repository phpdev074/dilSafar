import bcrypt from 'bcrypt';

export const hashPassword = async (plainPassword) => {
    const saltRounds = 10;
    return bcrypt.hash(plainPassword, saltRounds);
};