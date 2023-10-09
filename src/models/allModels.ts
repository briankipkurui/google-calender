
export interface userAtribute {
    email: string,
    phoneNumber: string,
    password: string,
    firstName: string,
    lastName: string,
}
export interface rolesAtributes {
    name: string
}

export interface productAtributes {
    name: string,
    price: number
}
export const validUserKeys: Set<string> = new Set([
    'email',
    'phoneNumber',
    'password',
    'firstName',
    'lastName'
])
export const validRolesKeys: Set<string> = new Set([
    'name',
])
