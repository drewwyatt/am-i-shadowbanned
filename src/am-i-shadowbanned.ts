#!/usr/bin/env node
import './polyfills'

import chalk from 'chalk'
import * as commander from 'commander'
import * as inquirer from 'inquirer'

import * as actions from './actions'
import { questions } from './questions'

commander.version('0.1.0').description('Reddit username validator')

commander
    .command('validate')
    .alias('v')
    .description('Parse a CSV file containing usernames and check for shadowbanned entries')
    .action(() => {
        console.log(chalk.yellow('=========*** Am I Shadowbanned? ***=========='))
        inquirer
            .prompt(questions)
            .then(answers => actions.parseFile(answers.inputFile, answers.outputFile))
    })

commander.parse(['', '', 'validate'])
