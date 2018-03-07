import chalk from 'chalk'
import * as ora from 'ora'
import axios from 'axios'
import { readFileSync } from 'fs'

export const parseFile = (path: string) => {
    ;(async () => {
        const spinner = ora('Reading file...').start()
        try {
            const file = readFileSync(path, 'utf8')
            const usernames = file.split('\n')
            spinner.stop()
            console.log(chalk.bgGreen.white('File parsed'))
            usernames.forEach(checkUsername)
        } catch (error) {
            spinner.stop()
            console.log(chalk.bgRed.white('Could not read file'))
        }
    })()
}

export const checkUsername = (username: string) => {
    ;(async () => {
        const spinner = ora('Checking username...').start()
        try {
            const response = await axios.get(`https://www.reddit.com/user/${username}`)
            spinner.stop()
            console.log(chalk.bgGreen.white(`Username "${username}" OK`))
        } catch (error) {
            spinner.stop()
            console.log(chalk.bgRed.white(`Username "${username}" not found`))
        }
    })()
}
