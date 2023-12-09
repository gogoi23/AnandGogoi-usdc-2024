/** 
 * RECOMMENDATION
 * 
 * To test your code, you should open "tester.html" in a web browser.
 * You can then use the "Developer Tools" to see the JavaScript console.
 * There, you will see the results unit test execution. You are welcome
 * to run the code any way you like, but this is similar to how we will
 * run your code submission.
 * 
 * The Developer Tools in Chrome are available under the "..." menu, 
 * futher hidden under the option "More Tools." In Firefox, they are 
 * under the hamburger (three horizontal lines), also hidden under "More Tools." 
 */

/**
 * Searches for matches in scanned text. It returns all lines that have the search term.
 * If a line has a hyphenated word break and the word on the next line perfectly matches
 * the search term it adds both lines to the return value. For example if line 1 says "he sa-"
 * and line 2 says "w the sky" and the user is looking for saw
 * then both lines 1 and 2 would be included. It assumes line 
 * numbers are consecutive.
 * @param {string} searchTerm - The word or term we're searching for. 
 * @param {JSON} scannedTextObj - A JSON object representing the scanned text.
 * @returns {JSON} - Search results. Contains searchTearm and results.
 * */ 
function findSearchTermInBooks(searchTerm, scannedTextObj) {
    /** You will need to implement your search and 
     * return the appropriate object here. */
    let validLines = [] // All lines that contain the search word are stored here
    
     // This is the size of the search term. Declared here to avoid calling length variable mulitple times
    let searchTermSize = searchTerm.length

    // If the user enters a blank input the program returns an error message
    if(searchTermSize == 0){
        return{ "SearchTerm" : searchTerm,"Error" : "Please do not enter an empty string."}
    }

    // If the serach has spaces in front of behind the search term it returns an error message
    let trimmed = searchTerm
    if(trimmed.trim() != searchTerm){
        return{ "SearchTerm" : searchTerm,"Error" : "Please do not enter any spaces in front of or behind the word."}
    }

    // Iterates through every book in scannedTextObj
    for (let i = 0;i<scannedTextObj.length;i++) {
        let currentBook = scannedTextObj[i] // Current book being scanned.
        let currentBookContent = currentBook.Content// Current book's lines being scanned.
        let hyphenated = false // this keeps track of if the last line ended in a hyphenated word break
        
        // If a line needs to be modified the value is stored here to avoid altering input data 
        let completedLine = "" 

        // Iterates through every line in the current book
        for(let ib=0; ib<currentBookContent.length; ib++){
            let currentBookContentLine = currentBookContent[ib] // This contains info about the current line being parsed
            let currentLineText = currentBookContentLine.Text // This is the text of the current line being parsed

            
            //if the last line had a hyphenated word break this current line gets modified 
            //This is explained more in the next if statement
            if(hyphenated){
                currentLineText = completedLine
            }

            /**this checks if the current line has a hyphenated word break. If it does it changes the current line
             * by adding the first word of the next line to the last word of the current line. It also add the last
             * word of the current line to the first word of the next line. For example if line 1 says "he sa-"
             * and line 2 says "w the sky" the lines would be changed to "he saw" and "saw the sky". 
            */
            if(currentLineText.charAt(currentLineText.length - 1) === '-' && ib<currentBookContent.length -1){    
                currentLineText = currentLineText.slice(0, -1)// removes the hyphen from current line
                let wordsArray = currentLineText.split(' ');
                let currentBookContentArray = currentBookContent[ib+1].Text.split(' ');
                currentLineText = currentLineText + currentBookContentArray[0]// appends the first word of the next line to the current line
                
                //the next iteration of the forloop will look for the word in completedLine
                completedLine = wordsArray[wordsArray.length-1] + currentBookContent[ib+1].Text // adds the last word of current line to the beginning of next line to the current line
                hyphenated = true
                
            }
            else {
                hyphenated = false 
            }

            let currentLineSize = currentLineText.length // This is the size of the current line being parsed
            
            // This forloop looks for the word at every position in the current line.
            // If the search term is bigger than the current line the forloop doesn't run and the line is skipped 
            for(let ic = 0; ic<=currentLineSize - searchTermSize; ic++){
                currentWord = currentLineText.substring(ic, ic + searchTermSize); // this is the current word being processed
            
                // This checks if the current word matches the search word
                if(currentWord == searchTerm){
                    let valid  = true 
                
                // These if statements checks if their is a letter behind or in front of the word
                // This prevents cases like "then" being detected when the word is "the"
                if (ic != 0 && !isNotLetterOrNumber(currentLineText.charAt(ic - 1))) {
                    valid = false;
                   
                }
                if ( ic + searchTermSize< currentLineText.length && !isNotLetterOrNumber(currentLineText.charAt(ic +searchTermSize )) ) {
                    valid = false;
                }

                // This adds the line to the return value if the line has the search term. It then goes to the next line
                if( valid ){
                    let validLine = {
                        "ISBN": currentBook.ISBN,
                        "Page":currentBookContentLine.Page,
                        "Line": currentBookContentLine.Line
                    }
                    validLines.push(validLine)
                    break
                }
            }  
        }   
    }
}

//this is the return value
var result = {
        "SearchTerm": searchTerm,
        "Results": validLines
    };
    
    return result; 
}

/**This determines if a character is not a number or letter. It is a helper method for findSearchTermInBooks 
* @param {char} char - The char that is being analyzed
*/
function isNotLetterOrNumber(char) {
    // Regular expression to match anything that is not a letter or a number
    let regex = /[^a-zA-Z0-9]/;
  
    // Use the test method to check if the character does not match the regular expression
    return regex.test(char);
}

/** Example input object. */
const twentyLeaguesIn = [
    {
        "Title": "Twenty Thousand Leagues Under the Sea",
        "ISBN": "9780000528531",
        "Content": [
            {
                "Page": 31,
                "Line": 8,
                "Text": "now simply went on by her own momentum.  The dark-"
            },
            {
                "Page": 31,
                "Line": 9,
                "Text": "ness was then profound; and however good the Canadian\'s"
            },
            {
                "Page": 31,
                "Line": 10,
                "Text": "eyes were, I asked myself how he had managed to see, and"
            } 
        ] 
    }
]

    
/** Example output object */
const twentyLeaguesOut = {
    "SearchTerm": "the",
    "Results": [
        {
            "ISBN": "9780000528531",
            "Page": 31,
            "Line": 9
        }
    ]
}

/*
 _   _ _   _ ___ _____   _____ _____ ____ _____ ____  
| | | | \ | |_ _|_   _| |_   _| ____/ ___|_   _/ ___| 
| | | |  \| || |  | |     | | |  _| \___ \ | | \___ \ 
| |_| | |\  || |  | |     | | | |___ ___) || |  ___) |
 \___/|_| \_|___| |_|     |_| |_____|____/ |_| |____/ 
                                                      
 */

/* We have provided two unit tests. They're really just `if` statements that 
 * output to the console. We've provided two tests as examples, and 
 * they should pass with a correct implementation of `findSearchTermInBooks`. 
 * 
 * Please add your unit tests below.
 * */

/** Here is another list of books being adding to preform tests on
 * It has more books and more content. ITt would be beneficial
 * to test the solution on a more diverse set of data. It allows for to more edge cases.  
 */
const threeBooks = [
    {
        "Title": "Harry Potter",
        "ISBN": "9708523522531",
        "Content": [
            {
                "Page": 1,
                "Line": 3,
                "Text": "He walked into the room and saw his dog"
            },
            {
                "Page": 1,
                "Line": 4,
                "Text": "The dog ran and jumped over a wall. He"
            },
            {
                "Page": 1,
                "Line": 5,
                "Text": "had wondered where his jacket had gone."
            } 
        ] 
    },
    {
        "Title": "The Cather in the Rye",
        "ISBN":"3023920109143",
        "Content": [
            {
                "Page": 10,
                "Line": 8,
                "Text": "he dog appeared to be sleeping but he was not sure"
            },
            {
                "Page": 10,
                "Line": 9,
                "Text": ".He had traveled all the way from India to come to t-"
            },
            {
                "Page": 10,
                "Line": 10,
                "Text": "o vist. Her hair was purple which he found to be quite intriguing."
            },
            {
                "Page": 10,
                "Line": 11,
                "Text": "She saw a mysterious castle stood tall against the "
            },
            {
                "Page": 10,
                "Line": 12,
                "Text": "The distance, a faint sound of music could be heard."
            },
            {
                "Page": 10,
                "Line": 13,
                "Text": "A gust of wind rustled the leaves, creating a soothing"
            },
            {
                "Page": 10,
                "Line": 14,
                "Text": " sun set, the sky was painted in hues of orange and pink."
            }
        ] 
    },
    {
        "Title": "Hunger Games",
        "ISBN": "7783617528599",
        "Content": [
            {
                "Page": 99,
                "Line": 8,
                "Text": 'where had the cat gone. His collar is nowhere to be found" said Katniss in a concerned tone'
            },
            {
                "Page": 99,
                "Line": 9,
                "Text": '"I dont know" said Peeta "Mr. Mittens must have ran off when we were not looking" sai-'
            },
            {
                "Page": 100,
                "Line": 1,
                "Text": "d Rue. The room became quiet and a dark unwelcoming tone had entered the room making every-"
            },
            {
                "Page": 100,
                "Line": 2,
                "Text": "one scared. The floor rumbled a giant truck came barraling through the wall. The whole room"
            },
            {
                "Page": 100,
                "Line": 3,
                "Text": "started to shake. Peeta went flying back while Rue quickly took cover behinda a couch. She"
            }

        ] 
    }
]

/**This book list has more hyphenated word breaks which will be used to test the algorithm on 
 * hyphens
*/
const hyphenTest = [
    {
        "Title": "Twenty Thousand Leagues Under the Sea",
        "ISBN": "9780000528531",
        "Content": [
            {
                "Page": 31,
                "Line": 8,
                "Text": "darkness had started approaching. Wh-"
            },
            {
                "Page": 31,
                "Line": 9,
                "Text": "ere did it come from. Jerry wa-"
            },
            {
                "Page": 31,
                "Line": 10,
                "Text": "s starting to think if the house was haunted"
            } 
        ] 
    }
]

//  This book list has 3 empty books. Used to test on empty books
const emptyBooks = [
    {
        "Title": "Harry Potter",
        "ISBN": "9708523522531",
        "Content": [] 
    },
    {
        "Title": "The Cather in the Rye",
        "ISBN":"3023920109143",
        "Content": [] 
    },
    {
        "Title": "Hunger Games",
        "ISBN": "7783617528599",
        "Content": [] 
    }
]

/**This list has one book with one line. Used to test the algorithm on numbers */
const numberTest = [
    {
        "Title": "Iphone Manual",
        "ISBN": "9780000528531",
        "Content": [
            {
                "Page": 1,
                "Line": 1,
                "Text": "iPhone 15"
            } 
        ] 
    }
]


const testResultExpected3 = {
    "SearchTerm":"he",
    "Results":[
        {"ISBN":"3023920109143",
        "Page":10,
        "Line":8},
        {"ISBN":"3023920109143",
        "Page":10,
        "Line":10
        }
    ]
}

const testResultExpected4 = {
    "SearchTerm":"xylophone",
    "Results":[]
}

const testResultExpected5 = {
    "SearchTerm":"I",
    "Results":[
        {
            "ISBN":"7783617528599",
            "Page": 99,
            "Line": 9,
    }
    ]
}

const testResultExpected6 = {
    "SearchTerm":"wall",
    "Results":[
        {
            "ISBN":"9708523522531",
            "Page":1,
            "Line":4
        },
        {
            "ISBN":"7783617528599",
            "Page":100,
            "Line":2
        }
    ]
}

const testResultExpected7 = {
    "SearchTerm":"dog",
    "Results":[
        {
            "ISBN":"9708523522531",
            "Page": 1,
            "Line": 3,
        },
        {
            "ISBN":"9708523522531",
            "Page": 1,
            "Line": 4,
        },
        {
            "ISBN": "3023920109143",
            "Page": 10,
            "Line": 8
        }
    ]
}

const testResultExpected8 = {
    "SearchTerm":"now",
    "Results":[
        {
            "ISBN":"9780000528531",
            "Page": 31,
            "Line": 8
            
        }
    ]
}

const testResultExpected9 =  {
    "SearchTerm":"darkness",
    "Results":[
        {"ISBN":"9780000528531","Page":31,"Line":8},
        {"ISBN":"9780000528531","Page":31,"Line":9}
    ]
}

const testResultExpected17={
    "SearchTerm":"iPhone 15",
    "Results":[
        {
            "ISBN":"9780000528531",
            "Page":1,"Line":1
        }
    ]
}


/** We can check that, given a known input, we get a known output. */
//Note that this also check the difference between 
const test1result = findSearchTermInBooks("the", twentyLeaguesIn);
if (JSON.stringify(twentyLeaguesOut) === JSON.stringify(test1result)) {
    console.log("PASS: Test 1");
} else {
    console.log("FAIL: Test 1");
    console.log("Expected:", twentyLeaguesOut);
    console.log("Received:", test1result);
}

/** We could choose to check that we get the right number of results. */
const test2result = findSearchTermInBooks("the", twentyLeaguesIn); 
if (test2result.Results.length == 1) {
    console.log("PASS: Test 2");
} else {
    console.log("FAIL: Test 2");
    console.log("Expected:", twentyLeaguesOut.Results.length);
    console.log("Received:", test2result.Results.length);
}


/**Testing if the method is case sensitive. So if a user is looking for the word "he"
* it wont return lines with the word "He". This case also check if words that include "he" like
* "the" are not included
*/
const test3Result = findSearchTermInBooks("he", threeBooks)
if (JSON.stringify(testResultExpected3) === JSON.stringify(test3Result)) {
    console.log("PASS: Test 3");
} else {
    console.log("FAIL: Test 3");
    console.log("Expected:", testResultExpected3);
    console.log("Received:", test3Result);
}

//Here the code is testing if it works when the search term does not exist. 
const test4Result = findSearchTermInBooks("xylophone", threeBooks)
if (JSON.stringify(testResultExpected4) === JSON.stringify(test4Result)) {
    console.log("PASS: Test 4");
}
else{
    console.log("FAIL: Test 4");
    console.log("Expected:", testResultExpected4);
    console.log("Received:", test4Result);
}

/**This is checking if this works on words that come right after punctuation. So if the 
 * algorithm is looking for "I" and the line says "Peeta said "I dont know " " this line would 
 * be included. It also check if the algorithm is case sensitive. 
*/

const test5Result = findSearchTermInBooks("I", threeBooks)
if (JSON.stringify(testResultExpected5) === JSON.stringify(test5Result)) {
    console.log("PASS: Test 5");
}
else{
    console.log("FAIL: Test 5");
    console.log("Expected:", testResultExpected5);
    console.log("Received:", test5Result);
}

/** This is checking if the algorithm works on words that come right before punctuation marks.
 *  So if I am looking for the word "wall" a line that says "The dog ran and jumped 
 *  over a wall." should be included
*/

const test6Result = findSearchTermInBooks("wall", threeBooks)
if (JSON.stringify(testResultExpected6) === JSON.stringify(test6Result)) {
    console.log("PASS: Test 6");
}
else{
    console.log("FAIL: Test 6");
    console.log("Expected:", testResultExpected6);
    console.log("Received:", test6Result);
}

/**
 * This checks if the method can detect lines that have the searched word at the end of them. 
 */
const test7Result = findSearchTermInBooks("dog", threeBooks)
if(JSON.stringify(testResultExpected7) === JSON.stringify(test7Result)){
    console.log("PASS: Test 7")
}
else{
    console.log("FAIL: Test 7");
    console.log("Expected:", testResultExpected7);
    console.log("Received:", test7Result);
}

/**
 * This checks if the method can detect lines that have the searched word at the begining of them. 
 */

const test8Result = findSearchTermInBooks("now", twentyLeaguesIn)
if(JSON.stringify(testResultExpected8) === JSON.stringify(test8Result)){
    console.log("PASS: Test 8")
}
else{
    console.log("FAIL: Test 8");
    console.log("Expected:", testResultExpected8);
    console.log("Received:", test8Result);
}

/**
 * This checks if the method works on hyphenated word breaks.
 */

const test9Result = findSearchTermInBooks("darkness", twentyLeaguesIn)
if(JSON.stringify(testResultExpected9) === JSON.stringify(test9Result)){
    console.log("PASS: Test 9")
}
else{
    console.log("FAIL: Test 9");
    console.log("Expected:", testResultExpected9);
    console.log("Received:", test9Result);
}

/**
 * This checks if the method works on lines with hyphens
 */
const test10result = findSearchTermInBooks("approaching", hyphenTest); 
if (test10result.Results.length == 1) {
    console.log("PASS: Test 10");
} else {
    console.log("FAIL: Test 10");
    console.log("Expected:", 1);
    console.log("Received:", test10result.Results.length);
}

/**
 * This checks if the method works on lines with hyphens
 */
const test11result = findSearchTermInBooks("starting", hyphenTest); 
if (test11result.Results.length == 1) {
    console.log("PASS: Test 11");
} else {
    console.log("FAIL: Test 11");
    console.log("Expected:", 1);
    console.log("Received:", test11result.Results.length);
}

/**
 * This checks if the method can handle when users enter words that are bigger than the actual lines
 */
const test12result = findSearchTermInBooks("nSupercalifragilisticexpialidociousoghuqghrwiogjreioqughrowjioeqrnlierhgofwrnouqeghopreqjgoqiwrgreqognrwq", hyphenTest); 
if (test12result.Results.length == 0) {
    console.log("PASS: Test 12");
} else {
    console.log("FAIL: Test 12");
    console.log("Expected:", 1);
    console.log("Received:", test12result.Results.length);
}

/**
 * This checks if the method can handle mulitple words. 
 */
const test13result = findSearchTermInBooks("did it come from", hyphenTest); 
if (test13result.Results.length == 1) {
    console.log("PASS: Test 13");
} else {
    console.log("FAIL: Test 13");
    console.log("Expected:", 1);
    console.log("Received:", test13result.Results.length);
}

/**
 * This checks if the user enters an empy string
 */
const test14result = findSearchTermInBooks("", hyphenTest); 
if ( '{"SearchTerm":"","Error":"Please do not enter an empty string."}' === JSON.stringify(test14result)){
    console.log("PASS: Test 14");
}
else{
    console.log("FAIL: Test 14");
    console.log('Expected: {"SearchTerm":"","Error":"Please do not enter an empty string."}');
    console.log("Received:", JSON.stringify(test14result));
}

/**
 * This checks if the user searches an empty list
 */
const test15result = findSearchTermInBooks("Hello", []); 
if (test15result.Results.length == 0) {
    console.log("PASS: Test 15");
} else {
    console.log("FAIL: Test 15");
    console.log("Expected:", 0);
    console.log("Received:", test15result.Results.length);
}

/**
 * This checks if the user searches a list of empty books
 */
const test16result = findSearchTermInBooks("Hello", emptyBooks); 
if (test16result.Results.length == 0) {
    console.log("PASS: Test 16");
} else {
    console.log("FAIL: Test 16");
    console.log("Expected:", 0);
    console.log("Received:", test16result.Results.length);
}


/**
 * This verifies multiple things. It checks that algorithm works when the search term is as big as the line
 * It also verifies that it works with spaces in between. It also checks that the algorithm works on words. 
 */
const test17result = findSearchTermInBooks("iPhone 15", numberTest); 
if(JSON.stringify(testResultExpected17) === JSON.stringify(test17result)){
    console.log("PASS: Test 17")
}
else{
    console.log("FAIL: Test 17");
    console.log("Expected:", testResultExpected17);
    console.log("Received:", test17result);
}

//This is checking if the user enters a word with spaces in front of it 
const test18result = findSearchTermInBooks(" iPhone 15", numberTest); 

if(JSON.stringify({"SearchTerm":" iPhone 15","Error":"Please do not enter any spaces in front of or behind the word."}) === JSON.stringify(test18result)){
    console.log("PASS: Test 18")
}
else{
    console.log("FAIL: Test 18");
    console.log("Expected:", {"SearchTerm":" iPhone 15","Error":"Please do not enter any spaces in front of or behind the word."});
    console.log("Received:", test18result);
}

