
function sortPages(pages){
    const entries  = Object.entries(pages);
    entries.sort((a, b) => b[1] - a[1]);
    const sortedPages = Object.fromEntries(entries);
    return sortedPages;
}
 
function printReport(pages){
    console.log('Reporting has started.......');

    const sortedPages = sortPages(pages);

    for(let key in sortedPages) {
        console.log(`Found ${sortedPages[key]} internal links to ${key}`);
    }
}

export {printReport};