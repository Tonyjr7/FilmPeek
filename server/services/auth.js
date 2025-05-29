import bcrypt from 'bcryptjs';

const saltRounds = 10;

const hashedPassword = async (password) => {
    let hashed = await bcrypt.hash(password, saltRounds);

    return hashed;
}

export default hashedPassword;