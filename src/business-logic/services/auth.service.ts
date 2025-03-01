import jwt, { JwtPayload } from "jsonwebtoken";
import ENV from "@config/env.config";

class TokenService {
    private static JWT_SECRET = ENV.JWT_SECRET;

    static generateToken(payload: object, systemRole: string, expiresIn: string = "1d"): string {
        console.assert(payload, "Payload is required");
        console.assert(systemRole, "System role is required");

        return jwt.sign({ ...payload, systemRole }, this.JWT_SECRET, {
            expiresIn,
        } as jwt.SignOptions);
    }

    static verifyToken(token: string): JwtPayload | null {
        console.assert(token, "Token is required");

        return jwt.verify(token, this.JWT_SECRET) as JwtPayload;
    }
}

export default TokenService;
