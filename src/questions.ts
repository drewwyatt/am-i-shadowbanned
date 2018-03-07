import { Questions } from 'inquirer'

export const questions: Questions = [
    {
        type: 'input',
        name: 'inputFile',
        message: 'File to validate?',
    },
    {
        type: 'input',
        name: 'outputFile',
        message: 'Outout file path?',
    },
]
