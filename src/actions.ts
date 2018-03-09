import chalk from 'chalk'
import * as ora from 'ora'
import axios from 'axios'
import { readFileSync, writeFile } from 'fs'

type Username = string

const flatten = (data: string[], unflattened: any): string[] => [...data, ...unflattened[0]]

export const parseFile = (inputFile: string, outputFilePrefix: string) => {
    ;(async () => {
        const spinner = ora('Reading file...').start()
        try {
            const file = readFileSync(inputFile, 'utf8')
            const usernames = file
                .split('\n')
                .map(line => line.split(','))
                .reduce(flatten, [])
                .map(username => username.replace(/\*/g, ''))
            spinner.stop()
            console.log(chalk.bgGreen.white('File parsed'))
            reportResults(await Promise.all(usernames.map(checkUsername)), outputFilePrefix)
        } catch (error) {
            spinner.stop()
            console.log(chalk.bgRed.white('Could not read file'))
        }
    })()
}

const reportResults = (usernameResults: ReadonlyArray<[Username, boolean]>, filePrefix: string) => {
    ;(async () => {
        const spinner = ora('Writing results...').start()
        try {
            const [okay, shadowBanned] = usernameResults.reduce(splitUsernames, [[], []])
            await Promise.all([
                writeResultsToFile(okay, `${filePrefix}.csv`),
                writeResultsToFile(shadowBanned, `${filePrefix}.shadowbanned.csv`),
            ])
            spinner.stop()
            console.log(
                chalk.bgGreen.white(
                    `Results written to "${filePrefix}.csv" and "${filePrefix}.shadowbanned.csv"`,
                ),
            )
        } catch (error) {
            spinner.stop()
            console.log(chalk.bgRed.white('Error writing results files. Dumpinh error...'))
            console.error(error.message)
        }
    })()
}

const splitUsernames = (
    current: [ReadonlyArray<Username>, ReadonlyArray<Username>],
    next: [Username, boolean],
): [ReadonlyArray<Username>, ReadonlyArray<Username>] => {
    const [username, result] = next
    const [okay, shadowBanned] = current
    if (result) {
        return [[...okay, username], shadowBanned]
    }

    return [okay, [...shadowBanned, username]]
}

const writeResultsToFile = async (results: ReadonlyArray<Username>, file: string): Promise<any> => {
    const spinner = ora(`Writing results to ${file}...`).start()
    return new Promise((res, rej) => {
        writeFile(file, results.join('\n'), error => {
            spinner.stop()
            if (error) {
                rej(error)
            } else {
                res()
            }
        })
    })
}

const checkUsername = async (username: string): Promise<[Username, boolean]> => {
    const spinner = ora('Checking username...').start()
    try {
        const response = await axios.get(`https://www.reddit.com/user/${username}`)
        spinner.stop()
        console.log(chalk.bgGreen.white(`Username "${username}" OK`))
        return [username, true]
    } catch (error) {
        spinner.stop()
        console.log(chalk.bgRed.white(`Username "${username}" has been shadowbanned`))
        return [username, false]
    }
}
