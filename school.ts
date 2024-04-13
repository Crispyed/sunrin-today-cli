#!/usr/bin/env node
"use strict"

import chalk from "chalk";
import select from '@inquirer/select';
import { Command } from "commander";
import inquirer from "inquirer";
import fs from "fs";

export const prompt_init = [
    {
        name: "schoolName",
        type: "input",
        default: "선린인터넷고등학교",
        message: `What is your school named? ${chalk.gray("»")}`,
    },
    {
        name: "instagramId",
        type: "input",
        default: "sunrin_today",
        message: `What is your ${chalk.cyan("instagram id")} ${chalk.gray("for upload")}? ${chalk.gray("»")}`,
    },
    {
        name: "instagramPassword",
        type: "password",
        message: `What is your ${chalk.cyan("instagram password")} ${chalk.gray("for upload")}? ${chalk.gray("»")}`,
    }
]

export const prompt_init_discord = [
    {
        name: `discordWebhook`,
        type: "input",
        message: `What is your ${chalk.cyan("discord webhook URL")}? ${chalk.gray("»")}`,
    }
]

export const prompt_select_yes_no = [
    {
        name: "Yes",
        value: true,
    },
    {
        name: "No",
        value: false,
    }
]

export const prompt_add_meal = [
    {
        name: "date",
        type: "input",
        message: `What is the ${chalk.cyan("date")} of the meal ${chalk.red('yyyy-mm-dd')}? ${chalk.gray("»")}`,
    },
    {
        name: "meal",
        type: "input",
        message: `What is the ${chalk.cyan("meal")} of the day ${chalk.blue("seperate to /")}? ${chalk.gray("»")}`,
    }
]

export const prompt_add_meal_no_date = [
    {
        name: "meal",
        type: "input",
        message: `What is the ${chalk.cyan("meal")} of the day ${chalk.blue("seperate to /")}? ${chalk.gray("»")}`,
    }
]

function writeConfigFile(path: string, content: string) {
    fs.writeFileSync(path, content, 'utf-8');
}

function ensureDirectoryExists(dirPath: string) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
    }
}

function createConfigFile(schoolName: string, instagramId: string, instagramPassword: string, discordWebhook: string | null) {
    ensureDirectoryExists("./config");
    ensureDirectoryExists("./json");

    const configContent = `
export const config = {
    schoolName: '${schoolName}',
    instagram: {
        username: '${instagramId}', // Instagram ID
        password: '${instagramPassword}' // Instagram Password
    },
    discord: {
        on: ${discordWebhook ? true : false}, // Discord webhook usage
        webhook: '${discordWebhook}' // Discord webhook address
    },
    interval: '0 7 * * 1-5'
}`;

    writeConfigFile("./config/config.js", configContent);

    console.log("\n");
    console.log(chalk.green("Config file created!"));
}

function sortJsonByDate(json: any[]) {
    return json.sort((a: any, b: any) => {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
}

function mapJsonToMealList(json: any[]) {
    return json.map((meal: any) => {
        return {
            name: meal.date,
            value: meal
        }
    });
}

function ensureJsonFileExists(filePath: string) {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify([]), 'utf-8');
    }
}

function writeJsonFile(filePath: string, content?: any) {
    if(!content) {
        fs.writeFileSync(filePath, "[]", 'utf-8')
    } else {
        fs.writeFileSync(filePath, JSON.stringify(content), 'utf-8');
    }
}

function getJsonFile(filePath: string) {
    return fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath, 'utf-8')) : [];
}

function getNextDay(date: Date, meals: Meal[]): Date {
    const tomorrow = new Date(date);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if(tomorrow.getDay() === 0) {
        tomorrow.setDate(tomorrow.getDate() + 1);
    } else if(tomorrow.getDay() === 6) {
        tomorrow.setDate(tomorrow.getDate() + 2);
    }

    const exists = meals.find((meal: Meal) => meal.date === tomorrow.toISOString().split("T")[0]);

    if(exists) {
        return getNextDay(tomorrow, meals);
    } else {
        return tomorrow;
    }
}

export type Meal = {
    date: string;
    meal: string[];
};

const program = new Command();

program
    .name("sic")
    .version("1.0.0")
    .description("School info Instagram Uploader CLI")

program.command('init').description('Default settings for project setup').action(async () => {
    const initAnswers = await inquirer.prompt(prompt_init);
    const { schoolName, instagramId, instagramPassword } = initAnswers;

    const discordAnswers = await select({
        message: `Would you like to use ${chalk.cyan("Discord Webhook")} ${chalk.gray("for logging")}?`,
        choices: prompt_select_yes_no,
    });

    if(discordAnswers) {
        const discordPromptAnswers = await inquirer.prompt(prompt_init_discord);
        createConfigFile(schoolName, instagramId, instagramPassword, discordPromptAnswers.discordWebhook);
    } else {
        createConfigFile(schoolName, instagramId, instagramPassword, null);
    }
});

program.command('list').description('Show the list of meals.').action(async () => {
    if(!fs.existsSync("./json/meal.json"))  return console.log(chalk.red("meal.json file not found!\nFirst run the `sic add` command."));
    const json = getJsonFile("./json/meal.json");
    let sortedJson = sortJsonByDate(json);

    if (json.length === 0) {
        return console.log(chalk.red('The list is empty.'));
    }

    sortedJson.forEach((meal: any) => meal.date += ` (${["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][new Date(meal.date).getDay()]})`);

    const newJson = mapJsonToMealList(sortedJson);

    await select({
        message: `Select Date`,
        choices: newJson,
        loop: false
    }).then((answers: any) => {
        answers.meal.forEach((menu: any) => {
            console.log(`- ${chalk.yellow(menu)}`);
        });
    })
        
})

program.command('remove').option('-a, --all', 'Remove all meals.').description('Remove the meal from the list.').action(async (args) => {
    if(!fs.existsSync("./json")) return console.log(chalk.red("meal.json file not found!\nFirst run the `sic add` command."));
    const json = getJsonFile("./json/meal.json");

    if(args.all) {
        console.log(chalk.red("All meals removed!"));
        return writeJsonFile("./json/meal.json");
    }

    if (json.length === 0) {
        return console.log(chalk.red('The list is empty'));
    }

    json.sort((a: any, b: any) => {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

    const mealList = json.map((meal: any) => {
        return {
            name: meal.date,
            value: meal
        }
    });
    
    await select({
        message: `Please select the item you want to ${chalk.red("remove")}`,
        choices: mealList,
    }).then(async (answers: any) => {
        answers.meal.forEach((menu: any) => {
            console.log(`- ${chalk.yellow(menu)}`);
        });
        
        await select({
            message: `${chalk.red("Are you sure you want to remove this?")}`,
            choices: [
                {
                    name: "Remove this",
                    value: answers
                },
                {
                    name: "Cancel",
                    value: false
                }
            ]
        }).then((answers: any) => {
            if(answers) {
                const newJson = json.filter((meal: any) => {
                    return meal.date !== answers.date;
                });
                writeJsonFile("./json/meal.json", newJson);
                console.log(`${chalk.yellow(answers.date)} ${chalk.red("Removed!")}`);
            }
        })
    })
})

program.command('add').option('-a, --auto-date', 'Automatically select the next date.').description('Add meals to the list.').action(async (args) => {
    let prompt = [];

    ensureDirectoryExists("./json")
    ensureJsonFileExists("./json/meal.json");

    if(args.autoDate === 'auto-date') args.autoDate = false; 

    !args.autoDate ? prompt = (prompt_add_meal) : prompt = prompt_add_meal_no_date;
    
    inquirer.prompt(prompt).then(async (answers) => {
        const json = getJsonFile("./json/meal.json");

        let temp: any = answers;

        if (args.autoDate) {
            const nextDay = getNextDay(new Date(), json);
            temp = { date: nextDay?.toISOString().split("T")[0], meal: answers.meal }
        }
        
        if (json.find((meal: any) => meal.date === temp?.date) && !args.autoDate) {
            console.log(chalk.red("Already exists date!"));
            return;
        }

        temp.meal = temp?.meal.split("/");

        json.push(temp);
        writeConfigFile("./json/meal.json", JSON.stringify(json));

        console.log(`${chalk.yellow(temp.date)} ${chalk.blue(temp.meal)} \n${chalk.green("Added!")}`);
    })
})

program.parse(process.argv);