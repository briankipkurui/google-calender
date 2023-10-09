import { scrypt, randomBytes } from 'crypto'
import { promisify } from 'util'

const scryptAsync = promisify(scrypt)


export class utilities {

    static async toHash(password: string): Promise<string> {
        const salt = randomBytes(8).toString('hex')
        const buff = (await scryptAsync(password, salt, 64)) as Buffer
        return `${buff.toString('hex')}.${salt}`
    }
    static async compare(storedPassword: string, suppliedPassword: string) {
        const [hashedPassword, salt] = storedPassword.split('.');
        const buf = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;

        return buf.toString('hex') === hashedPassword;
    }

    static async generateRandomString(length: number): Promise<string> {
        const characters = '0123456789abcdef';
        let randomString = '';

        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            randomString += characters[randomIndex];
        }

        return randomString;
    }



}