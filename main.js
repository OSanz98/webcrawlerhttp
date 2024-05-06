import { crawlPage } from "./crawl.js";
import { printReport } from "./report.js";

function main () {
    const args = process.argv;
    console.log(args.length);
    if(args.length < 3 || args.length > 3) {
        console.error('You must pass ONLY one url argument.');
        process.exit(1); //exit with failure code. 0 is success code
    }

    console.log(`The crawler is starting at: ${args[2]}`);
    const pages = crawlPage(args[2], args[2], []);
    
    printReport(pages);
}

main();
