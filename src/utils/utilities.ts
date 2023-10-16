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

    static async generateRawData(data: any) {
        console.log("incoming data.......",data)
        const headers: any = [
            'created',
            'start.dateTime',
            'start.timeZone',
            'end.dateTime',
            'end.timeZone',
            'location',
            'summary',
            'description',
            'creator.email',
            'creator.self',
            'organizer.email',
            'organizer.self',
            'etag',
            'id',
            'status',
            'htmlLink',
            'kind',
            'updated',
            'sequence',
            'reminders',
            'eventType'
        ]

        const transformedData = data.map((item: any) => {
            const transformedItem: any = {};
            for (const header of headers) {
                const keys = header.split('.');
                let value = item;
                for (const key of keys) {
                    value = value[key];
                }
                transformedItem[header] = value;
            }
            return transformedItem;
        })

        return transformedData
    }


}