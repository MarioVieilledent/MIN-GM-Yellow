
/**
 * Not core of exercises, just js glue.
 * 
 * This file provides a simple js framework
 * in order to get a nice display and make website dynamic
 */

const lastPageVisitedConst = 'lastPageVisited';

let buttons = [
    document.getElementById('nav-button-page-1-introduction'),
    document.getElementById('nav-button-page-2-bezier-curves'),
    document.getElementById('nav-button-page-3-bezier-surfaces'),
    document.getElementById('nav-button-page-4-b-splines')
]

let pages = [
    'page-1-introduction',
    'page-2-bezier-curves',
    'page-3-bezier-surfaces',
    'page-4-b-splines'
];

let divs = [
    document.getElementById(pages[0]),
    document.getElementById(pages[1]),
    document.getElementById(pages[2]),
    document.getElementById(pages[3])
];

openFirstPage();

function openFirstPage() {
    // Get last page in localStorage
    let lastPageVisited = localStorage.getItem(lastPageVisitedConst);

    if (lastPageVisited) {
        displayPage(lastPageVisited);
    } else { // If no page saved in localStorage, open first page
        displayPage(0);
    }
}

function displayPage(pageId) {
    if (pages[pageId]) {
        // Hide all pages
        divs.forEach(div => {
            div.style.display = 'none';
        });
        // Reset color of nav buttons
        buttons.forEach(button => {
            button.style.backgroundColor = 'transparent';
        });
        // Select current page
        buttons[pageId].style.backgroundColor = '#36393F';
        localStorage.setItem(lastPageVisitedConst, pageId);
        // Display selected page
        divs[pageId].style.display = 'flex';
    } else {
        displayPage(0);
    }
}