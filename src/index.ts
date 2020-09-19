import { argv } from "yargs";

if (argv.cs) {
  console.log("scrape cs");
}

if (argv.nba) {
  console.log("scrape nba");
}

if (argv.football) {
  console.log("scrape football");
}

if (argv.all) {
  console.log("scrape football");
}
