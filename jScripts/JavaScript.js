// ===== נתונים =====
// מערכים מקבילים - אותו אינדקס = אותו פריט

// רמות (רדיו). רמה 1 באינדקס 0
const levelNames = ["רמה 1 - מתחילים", "רמה 2 - ממשיכים", "רמה 3 - מתקדמים"];
const levelImages = ["images/level-1.png", "images/level-2.png", "images/level-3.png"];

// תחומים (צ'קבוקס). האינדקס זהה למספר ב-id: cat0, cat1...
const categoryNames = ["שפות", "טכנולוגיה", "יצירה", "תנועה"];

// קורסים
const courseNames = ["ספרדית", "ערבית מדוברת", "פייתון", "בינה מלאכותית ככלי עבודה", "אקסל מעשי", "צילום בטלפון", "רישום ואיור", "יוגה לסטודנטים"];
const courseCategory = [0, 0, 1, 1, 1, 2, 2, 3]; // לאיזה תחום שייך כל קורס
const courseMaxLevel = [2, 1, 3, 2, 3, 2, 3, 3]; // הרמה הכי גבוהה בכל קורס (כולם מתחילים מ-1)

// הרמה שנבחרה. 0 = עוד לא בחרו
let chosenLevel = 0;


// בודקת אם יש שם ורמה - ורק אז הכפתור נפתח
// נקראת בהקלדה בשם (oninput) ואחרי בחירת רמה
function checkForm() {
    const userName = document.getElementById("userName").value;

    if (userName.length > 0 && chosenLevel > 0) {
        document.getElementById("sendBtn").disabled = false;
       
    }
    else {
        document.getElementById("sendBtn").disabled = true;
        
    }

    // השם מופיע בכותרת של הסיכום
    if (userName.length > 0) {
        document.getElementById("summaryTitle").innerHTML = "החיפוש שלי: " + userName;
    }
    else {
        document.getElementById("summaryTitle").innerHTML = "החיפוש שלי:";
    }
}


// רדיו: מקבלת את מספר הרמה (1, 2 או 3)
function chooseLevel(level) {
    chosenLevel = level;

    // במקום ההודעה מציגים את התמונה ואת שם הרמה
    document.getElementById("levelImageBox").innerHTML =
        "<img src='" + levelImages[level - 1] + "' alt='סמל " + levelNames[level - 1] + "'>" +
        "<p class='levelName'>" + levelNames[level - 1] + "</p>";

    updateSummary();
    checkForm();
}


// צ'קבוקס: מקבלת את מספר התחום ומשנה את השקיפות של התמונה שלו
function toggleCategory(index) {
    if (document.getElementById("cat" + index).checked == true) {
        document.getElementById("catImg" + index).style.opacity = "1";
    }
    else {
        document.getElementById("catImg" + index).style.opacity = "0.35";
    }

    updateSummary();
}


// מחזירה את שמות התחומים שסומנו, עם פסיק ביניהם
// אם לא סימנו כלום - מחזירה מחרוזת ריקה
function buildCategoryList() {
    let list = "";
    for (let i = 0; i < categoryNames.length; i++) {
        if (document.getElementById("cat" + i).checked == true) {
            if (list.length > 0) {
                list = list + ", ";
            }
            list = list + categoryNames[i];
        }
    }
    return list;
}

// בודקת אם קורס מתאים. מחזירה true או false
// מתאים = התחום שלו סומן (או שלא סימנו אף תחום) וגם יש בו את הרמה שנבחרה
function isCourseMatch(courseIndex, list) {
    let match = false;
    if (list == "" || document.getElementById("cat" + courseCategory[courseIndex]).checked == true) {
        if (courseMaxLevel[courseIndex] >= chosenLevel) {
            match = true;
        }
    }
    return match;
}

// מעדכנת את פס הסיכום: התחומים שסומנו וכמה קורסים מתאימים
function updateSummary() {
    const list = buildCategoryList();

    if (list == "") {
        document.getElementById("catSummary").innerHTML = "עוד לא נבחר תחום. ";
    }
    else {
        document.getElementById("catSummary").innerHTML = list;
    }

    // את מספר הקורסים מראים רק אחרי שבחרו רמה
    if (chosenLevel > 0) {
        let count = 0;
        for (let i = 0; i < courseNames.length; i++) {
            if (isCourseMatch(i, list) == true) {
                count = count + 1;
            }
        }

        if (count == 1) {
            document.getElementById("foundBox").innerHTML = "קורס אחד מתאים לבחירה שלך";
        }
        else {
            document.getElementById("foundBox").innerHTML = count + " קורסים מתאימים לבחירה שלך";
        }
    }
}


// כפתור האישור: בונה את ההודעה - שם, רמה, תחומים וקורסים מתאימים
function showResult() {
    const userName = document.getElementById("userName").value;
    const list = buildCategoryList();

    let message = "<h3>" + userName + ", אלה הקורסים בשבילך</h3>";
    message = message + "<p>רמה: " + levelNames[chosenLevel - 1] + "</p>";

    // אם לא סימנו אף תחום
    if (list == "") {
        message = message + "<p>לא בחרת תחום, לכן מוצגים קורסים מכל התחומים.</p>";
    }
    else {
        message = message + "<p>תחומים: " + list + "</p>";
    }

    // רשימת הקורסים שמתאימים
    let courses = "";
    for (let i = 0; i < courseNames.length; i++) {
        if (isCourseMatch(i, list) == true) {
            courses = courses + "<li>" + courseNames[i] + " (" + categoryNames[courseCategory[i]] + ")</li>";
        }
    }

    if (courses == "") {
        message = message + "<p>אין קורס ברמה הזו בתחומים שבחרת. נסו רמה נמוכה יותר או תחום נוסף.</p>";
    }
    else {
        message = message + "<p class='resultTitle'>הקורסים שמתאימים לך:</p><ul>" + courses + "</ul>";
    }

    document.getElementById("result").innerHTML = message;
}
