#!/usr/bin/env node
import { program } from "commander";
import fs from "fs-extra";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import prompts from "prompts";
import chalk from "chalk";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

program
       .command("create [projectName]")
       .description("Create a new project from template")
       .option("-t, --template <template>", "Specify template name")
       .action(async (projectName, options) => {
              const templatesPath = join(__dirname, "../templates");
              const templates = await fs.readdir(templatesPath);

              if (templates.length === 0) {
                     console.log(chalk.yellow("⚠️  No templates found!"));
                     return;
              }

              let chosenTemplate = options.template;
              let finalProjectName = projectName;

              // إذا لم يتم تحديد اسم المشروع، اسأل عنه
              if (!finalProjectName) {
                     const response = await prompts({
                            type: "text",
                            name: "projectName",
                            message: "Project name:",
                            initial: "my-project",
                            validate: (value) =>
                                   value.trim() === "" ? "Project name is required!" : true,
                     });

                     if (!response.projectName) {
                            console.log(chalk.red("\n✖ Operation cancelled"));
                            process.exit(1);
                     }

                     finalProjectName = response.projectName;
              }

              // إذا لم يتم تحديد التيمبلت، اعرض القائمة
              if (!chosenTemplate) {
                     const response = await prompts({
                            type: "select",
                            name: "template",
                            message: "Select a template:",
                            choices: templates.map((t) => ({ title: t, value: t })),
                     });

                     if (!response.template) {
                            console.log(chalk.red("\n✖ Operation cancelled"));
                            process.exit(1);
                     }

                     chosenTemplate = response.template;
              } else {
                     // تحقق من وجود التيمبلت المحدد
                     if (!templates.includes(chosenTemplate)) {
                            console.log(chalk.red(`\n✖ Template '${chosenTemplate}' not found!`));
                            console.log(
                                   chalk.cyan(`\n📋 Available templates: ${templates.join(", ")}`)
                            );
                            return;
                     }
              }

              const targetPath = join(process.cwd(), finalProjectName);
              const templatePath = join(templatesPath, chosenTemplate);

              // تحقق من وجود المجلد
              if (await fs.pathExists(targetPath)) {
                     const response = await prompts({
                            type: "confirm",
                            name: "overwrite",
                            message: `Directory '${finalProjectName}' already exists. Overwrite?`,
                            initial: false,
                     });

                     if (!response.overwrite) {
                            console.log(chalk.red("\n✖ Operation cancelled"));
                            return;
                     }
                     await fs.remove(targetPath);
              }

              console.log(
                     chalk.cyan(
                            `\n🚀 Creating project ${chalk.bold(
                                   finalProjectName
                            )} from ${chalk.bold(chosenTemplate)} template...\n`
                     )
              );

              await fs.ensureDir(targetPath);
              await fs.copy(templatePath, targetPath);

              // تحديث package.json
              const pkgPath = join(targetPath, "package.json");
              if (await fs.pathExists(pkgPath)) {
                     const pkg = await fs.readJSON(pkgPath);
                     pkg.name = finalProjectName;
                     await fs.writeJSON(pkgPath, pkg, { spaces: 2 });
              }

              console.log(chalk.green(`\n✓ Project created successfully!\n`));
              console.log(chalk.cyan(`  cd ${finalProjectName}`));
              console.log(chalk.cyan(`  npm install`));
              console.log(chalk.cyan(`  npm run dev\n`));
       });

// عرض التيمبلتس المتاحة
program
       .command("list")
       .description("List all available templates")
       .action(async () => {
              const templatesPath = join(__dirname, "../templates");
              const templates = await fs.readdir(templatesPath);

              if (templates.length === 0) {
                     console.log(chalk.yellow("⚠️  No templates found!"));
                     return;
              }

              console.log(chalk.cyan("\n📋 Available templates:\n"));
              templates.forEach((template, index) => {
                     console.log(chalk.white(`  ${index + 1}. ${template}`));
              });
              console.log();
       });

program.parse();
