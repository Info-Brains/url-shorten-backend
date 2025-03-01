import bcrypt from "bcryptjs";

class Hash {
    public static hash(password: string, round: number = 12): string {
        return bcrypt.hashSync(password, round);
    }

    public static compare(password: string, hash: string): boolean {
        return bcrypt.compareSync(password, hash);
    }
}

export default Hash;
