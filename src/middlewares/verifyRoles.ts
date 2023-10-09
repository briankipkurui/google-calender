import { NotAuthorizedError } from "../errors/not-authorized-error";

export const verifyRoles = (...allowedRoles:any) => {
    return (req: any, res: any, next: any) => {
        if (!req?.roles) {
         throw new NotAuthorizedError()
        }
        const rolesArray = [...allowedRoles];
        const result = req.roles.map((role: any) => rolesArray.includes(role)).find((val: any) => val === true);
        if (!result) {
            throw new NotAuthorizedError()
        }
        next()
    }
}