#!/usr/bin/env node
"use strict"
import chalk from "chalk";
import select from '@inquirer/select';
import { Command } from "commander";
import inquirer from "inquirer";
import fs from "fs";

function makeConfigFile(schoolName: string, instagramId: string, instagramPassword: string, discordWebhook: string | null) {
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
    .description("School info Instagram Uploader CLI")

program.command('init')
    .description('프로젝트 설정을 위한 기본 세팅')
    .action(async () => {
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
            ]).then(async (answers) => {
                const { schoolName, instagramId, instagramPassword } = answers;
                await select({
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
                }).then(async (answers: any) => {
                    if(answers) {
                        inquirer
                            .prompt([
                                {
                                    name: `discordWebhook`,
                                    type: "input",
                                    message: `What is your ${chalk.cyan("discord webhook URL")}? ${chalk.gray("»")}`,
                                }
                            ]).then((answers) => {
                                makeConfigFile(schoolName, instagramId, instagramPassword, answers.discordWebhook);
                            })
                    } else {
                        makeConfigFile(schoolName, instagramId, instagramPassword, null);
                    }
                })
            })
    });

program.command('list')
    .description('급식 리스트를 보여줍니다')
    .action(async () => {
        if(!fs.existsSync("./config")) {
            return console.log(chalk.red("meal.json file not found!\nFirst run the `school add` command."));
        } else {
            const json = fs.existsSync("./json/meal.json") ? JSON.parse(fs.readFileSync("./json/meal.json", 'utf-8')) : [];
            json.sort((a: any, b: any) => {
                return new Date(a.date).getTime() - new Date(b.date).getTime();
            })
            json.map((meal: any) => {
                console.log(chalk.green(meal.date));
            });
            
        }
    })

program.command('delete')
    .description('급식을 삭제합니다')
    .action(async () => {
        if(!fs.existsSync("./config")) {
            return console.log(chalk.red("meal.json file not found!\nFirst run the `school add` command."));
        } else {
            const json = fs.existsSync("./json/meal.json") ? JSON.parse(fs.readFileSync("./json/meal.json", 'utf-8')) : [];

            json.sort((a: any, b: any) => {
                return new Date(a.date).getTime() - new Date(b.date).getTime();
            })
            const mealList = json.map((meal: any) => {
                return {
                    name: meal.date,
                    value: meal
                }
            });
            
            await select({
                message: `Please select the item you want to ${chalk.red("delete")}`,
                choices: mealList,
            }).then(async (answers: any) => {
                answers.meal.forEach((menu: any) => {
                    console.log(chalk.yellow(menu));
                });
                await select({
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
                }).then((answers: any) => {
                    if(answers) {
                        const newJson = json.filter((meal: any) => {
                            return meal.date !== answers.date;
                        });
                        fs.writeFileSync("./json/meal.json", JSON.stringify(newJson), 'utf-8');
                        console.log(chalk.red("Deleted!"));
                    }
                })
            })
        }
    })

program.command('add')
    .description('급식을 추가합니다')
    .action(async () => {
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
            ]).then(async (answers) => {
                const json = fs.existsSync("./json/meal.json") ? JSON.parse(fs.readFileSync("./json/meal.json", 'utf-8')) : [];
                if(json.find((meal: any) => meal.date === answers.date)) {
                    console.log(chalk.red("Already exists date!"));
                    return;
                }
                answers.meal = answers.meal.split("/");
                json.push(answers);
                fs.writeFileSync("./json/meal.json", JSON.stringify(json), 'utf-8');
                console.log(chalk.green("Added!"));
            })
    })

program.parse(process.argv);