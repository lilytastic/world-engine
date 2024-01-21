export interface ICharacter {
    id: number;
    name: string;
    gender: 'M' | 'F' | 'X';
}
export const DEFAULT_CHARACTER: ICharacter = {
    id: 1,
    name: 'Jane Doe',
    gender: 'F'
}