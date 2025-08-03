#!/usr/bin/env node
const commander = require("commander");
const nanospinner = require("nanospinner");
const axios = require("axios");
const ansis = require('ansis');
const program = new commander.Command();

program.name("knpm").description("Check all info regarding npm!").version("1.0.0");

program.command("check").description("Shows all essential information about a package!").argument("<package>", "The package to check")
.action((package) => {
    const spinner = nanospinner.createSpinner("Fetching data...").start()
    axios.get(`https://registry.npmjs.org/${package}`).then(response => {
        const data = response.data;
        spinner.success("Successfully fetched data!");
        console.log(ansis.bold("--".repeat(40)));
        console.log(ansis.yellow.bold(`${data.name} v${data["dist-tags"].latest}`));
        console.log(ansis.bold("--".repeat(40)));
        console.log(ansis.bold(`${ansis.underline("Author:")} ${data.author.name} (${data.maintainers[0].email})`));
        console.log(ansis.bold(`${ansis.underline("Description:")} ${data.description}`));
        console.log(ansis.bold(`${ansis.underline("License:")} ${data.license}`));
        console.log(ansis.bold(`${ansis.underline("Dependencies:")} ${Object.entries((data.versions[data["dist-tags"].latest].dependencies || {})).map(([pkg, v]) => ansis.yellowBright.bold(`${pkg} ${v}`)).join(", ")}`));
        console.log(ansis.bold(`${ansis.underline("Dev Dependencies:")} ${Object.entries((data.versions[data["dist-tags"].latest].devDependencies || {})).map(([pkg, v]) => ansis.yellowBright.bold(`${pkg} ${v}`)).join(", ")}`));
        console.log(ansis.bold(`${ansis.underline("Keywords:")} ${(data.keywords || []).join(", ")}`));
        console.log(ansis.bold(`${ansis.underline("Current Version:")} ${data["dist-tags"].latest}`));
        console.log(`${ansis.bold.underline("Maintainers: \n")}${`${(data.maintainers || []).map(item => ansis.yellowBright.bold(`${item.name}(${item.email})`)).join("\n")}`}`);
        console.log(ansis.bold(`${ansis.underline("Homepage:")} ${ansis.blueBright(data.homepage)}`));
        console.log(ansis.bold(`${ansis.underline("NPM Link:")} ${ansis.blueBright(`https://npmjs.com/package/${data.name}`)}`));
        console.log(ansis.bold("--".repeat(40)));
    })
    .catch(err => {
        spinner.error("An unexpected errror occured!")
        console.log(ansis.red.bold(err))
    })
})

program.command("downloads").description("Check the last week downloads of a npm package!").argument("<package>", "The package to check")
.action((package) => {
    const spinner = nanospinner.createSpinner("Fetching data...").start()
    axios.get(`https://api.npmjs.org/downloads/point/last-week/${package}`).then(response => {
        const data = response.data;
        spinner.success("Successfully fetched data!");
        console.log("--".repeat(40));
        console.log(ansis.yellow.bold(data.package));
        console.log("--".repeat(40));
        console.log(ansis.bold(`From ${ansis.yellow.underline(data.start)} to ${ansis.yellow.underline(data.end)}`));
        console.log(ansis.bold(`${ansis.yellow.underline(data.downloads.toLocaleString())} Downloads`))
        console.log("--".repeat(40));
    })
})

program.parse(process.argv)