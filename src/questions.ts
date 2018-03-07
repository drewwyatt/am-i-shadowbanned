import { Questions } from 'inquirer'

export const questions: Questions = [
    {
        type: 'input',
        name: 'fileLocation',
        message: 'File to validate?',
    },
]
