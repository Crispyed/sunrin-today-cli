#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import chalk from "chalk";
import select from '@inquirer/select';
import { Command } from "commander";
import inquirer from "inquirer";
import fs from "fs";
function makeConfigFile(schoolName, instagramId, instagramPassword, discordWebhook) {
    !fs.existsSync("./config") && fs.mkdirSync("./config");
    !fs.existsSync("./json") && fs.mkdirSync("./json");
    fs.writeFileSync("./config/config.js", `export const config = {
    schoolName: '${schoolName}',
    instagram: {
        username: '${instagramId}', // 인스타그램 아이디
        password: '${instagramPassword}' // 인스타그램 비밀번호
    },
    discord: {
        on: ${discordWebhook ? true : false}, // 디스코드 웹훅 사용 여부
        webhook: '${discordWebhook}' // 디스코드 웹훅 주소
    },
    interval: '0 7 * * 1-5'
}
    `, 'utf-8');
    console.log("\n");
    console.log(chalk.green("Config file created!"));
}
const program = new Command();
program
    .version("1.0.0")
    .description("School info Instagram Uploader CLI");
program.command('init')
    .description('프로젝트 설정을 위한 기본 세팅')
    .action(() => __awaiter(void 0, void 0, void 0, function* () {
    inquirer
        .prompt([
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
        },
    ]).then((answers) => __awaiter(void 0, void 0, void 0, function* () {
        const { schoolName, instagramId, instagramPassword } = answers;
        yield select({
            message: `Would you like to use ${chalk.cyan("Discord Webhook")} ${chalk.gray("for logging")}?`,
            choices: [
                {
                    name: "Yes",
                    value: true,
                },
                {
                    name: "No",
                    value: false,
                }
            ],
        }).then((answers) => __awaiter(void 0, void 0, void 0, function* () {
            if (answers) {
                inquirer
                    .prompt([
                    {
                        name: `discordWebhook`,
                        type: "input",
                        message: `What is your ${chalk.cyan("discord webhook URL")}? ${chalk.gray("»")}`,
                    }
                ]).then((answers) => {
                    makeConfigFile(schoolName, instagramId, instagramPassword, answers.discordWebhook);
                });
            }
            else {
                makeConfigFile(schoolName, instagramId, instagramPassword, null);
            }
        }));
    }));
}));
program.command('list')
    .description('급식 리스트를 보여줍니다')
    .action(() => __awaiter(void 0, void 0, void 0, function* () {
    if (!fs.existsSync("./config")) {
        return console.log(chalk.red("meal.json file not found!\nFirst run the `school add` command."));
    }
    else {
        const json = fs.existsSync("./json/meal.json") ? JSON.parse(fs.readFileSync("./json/meal.json", 'utf-8')) : [];
        json.sort((a, b) => {
            return new Date(a.date).getTime() - new Date(b.date).getTime();
        });
        json.map((meal) => {
            console.log(chalk.green(meal.date));
        });
    }
}));
program.command('delete')
    .description('급식을 삭제합니다')
    .action(() => __awaiter(void 0, void 0, void 0, function* () {
    if (!fs.existsSync("./config")) {
        return console.log(chalk.red("meal.json file not found!\nFirst run the `school add` command."));
    }
    else {
        const json = fs.existsSync("./json/meal.json") ? JSON.parse(fs.readFileSync("./json/meal.json", 'utf-8')) : [];
        json.sort((a, b) => {
            return new Date(a.date).getTime() - new Date(b.date).getTime();
        });
        const mealList = json.map((meal) => {
            return {
                name: meal.date,
                value: meal
            };
        });
        yield select({
            message: `Please select the item you want to ${chalk.red("delete")}`,
            choices: mealList,
        }).then((answers) => __awaiter(void 0, void 0, void 0, function* () {
            answers.meal.forEach((menu) => {
                console.log(chalk.yellow(menu));
            });
            yield select({
                message: `${chalk.red("Are you sure you want to delete this?")}`,
                choices: [
                    {
                        name: "Delete This",
                        value: answers
                    },
                    {
                        name: "Exit",
                        value: false
                    }
                ]
            }).then((answers) => {
                if (answers) {
                    const newJson = json.filter((meal) => {
                        return meal.date !== answers.date;
                    });
                    fs.writeFileSync("./json/meal.json", JSON.stringify(newJson), 'utf-8');
                    console.log(chalk.red("Deleted!"));
                }
            });
        }));
    }
}));
program.command('add')
    .description('급식을 추가합니다')
    .action(() => __awaiter(void 0, void 0, void 0, function* () {
    !fs.existsSync("./json") && fs.mkdirSync("./json");
    !fs.existsSync("./json/meal.json") && fs.writeFileSync("./json/meal.json", "[]", 'utf-8');
    inquirer
        .prompt([
        {
            name: "date",
            type: "input",
            message: `What is the ${chalk.cyan("date")} of the meal? ${chalk.gray("»")}`,
        },
        {
            name: "meal",
            type: "input",
            message: `What is the ${chalk.cyan("meal")} of the day ${chalk.blue("seperate to /")}? ${chalk.gray("»")}`,
        },
    ]).then((answers) => __awaiter(void 0, void 0, void 0, function* () {
        const json = fs.existsSync("./json/meal.json") ? JSON.parse(fs.readFileSync("./json/meal.json", 'utf-8')) : [];
        if (json.find((meal) => meal.date === answers.date)) {
            console.log(chalk.red("Already exists date!"));
            return;
        }
        answers.meal = answers.meal.split("/");
        json.push(answers);
        fs.writeFileSync("./json/meal.json", JSON.stringify(json), 'utf-8');
        console.log(chalk.green("Added!"));
    }));
}));
program.parse(process.argv);
//# sourceMappingURL=school.js.map