/* IVR1 – Ivrit card decks.
   Rules: every card id is stable and never reused. New cards go at the END of a lesson's list.
   Hebrew inside «» is rendered right-to-left.
   Card types:
     E(id, title, [lines], example)         explainer
     T(id, hebrew, english, note)           key term, tap to reveal
     Q(id, question, [options], answerIdx, why)   quick check (multiple choice or true/false)
*/
(function () {
  var COURSE = "ivr1";
  function E(id, title, lines, example) { return { type: "explain", id: id, title: title, lines: lines, example: example || "" }; }
  function T(id, term, def, note) { return { type: "term", id: id, term: term, def: def, note: note || "" }; }
  function Q(id, q, options, answer, why) { return { type: "quiz", id: id, q: q, options: options, answer: answer, why: why }; }
  var TF = ["True", "False"];

  function lesson(id, title, cards) {
    cards.forEach(function (c) { c.id = COURSE + "-" + id + "-" + c.id; });
    return { id: id, title: title, cards: cards };
  }

  var u6 = {
    id: "u6",
    short: "Unit 6",
    title: "Unit 6 · Food, celebrations and the week",
    lessons: [
      lesson("u6-l1", "Everyone and no one", [
        E("e1", "Everyone: «כולם»", [
          "«כולם» means everyone. Because it stands for many people, the verb after it is plural.",
          "Think of it as \"all of them\". All of them eat, all of them study."
        ], "«בקיץ כולם אוכלים בטבע» – In summer everyone eats outdoors."),
        E("e2", "No one: «אף אחד»", [
          "«אף אחד» means no one. It always travels with «לא» before the verb.",
          "In Hebrew you say \"no one doesn't study\". The double negative is correct and required.",
          "The verb stays singular, because \"no one\" is one (zero) person."
        ], "«ביום ראשון אף אחד לא לומד בבית הספר» – On Sunday no one studies at school."),
        T("t1", "כולם", "everyone", "takes a plural verb"),
        T("t2", "אף אחד", "no one", "always followed by «לא»"),
        T("t3", "לא", "not, no"),
        Q("q1", "Which sentence is correct?", ["אף אחד לומד בבית הספר", "אף אחד לא לומד בבית הספר"], 1, "No one is always «אף אחד לא», never «אף אחד» on its own."),
        Q("q2", "Fill the blank: «בקיץ כולם ___ בטבע»", ["אוכל", "אוכלת", "אוכלים"], 2, "Everyone is plural, so the verb is plural: «אוכלים»."),
        Q("q3", "«כולם» takes a singular verb.", TF, 1, "False. Everyone is many people, so the verb is plural."),
        Q("q4", "How do you say \"On Shabbat no one goes to school\"?", ["בשבת כולם הולכים לבית הספר", "בשבת אף אחד הולכים לבית הספר", "בשבת אף אחד לא הולך לבית הספר"], 2, "No one needs «לא» and a singular verb: «אף אחד לא הולך»."),
        Q("q5", "«אף אחד לא» is a mistake because it has two negatives.", TF, 1, "False. The double negative is exactly how Hebrew says \"no one does\".")
      ]),

      lesson("u6-l2", "The little word «את»", [
        E("e1", "What «את» does", [
          "«את» sits in front of a definite direct object: the thing the verb acts on, when it is a specific thing.",
          "A noun is definite when it has «ה» (the), is a name, or has \"my / your\" attached.",
          "«את» has no English translation. It is a signpost, not a word you say in English."
        ], "«רונית קוראת את הספרים» – Ronit reads the books."),
        E("e2", "When there is no «את»", [
          "If the object is not specific, there is no «את».",
          "\"Reads a book\" is just «קוראת ספר». \"Reads the book\" is «קוראת את הספר»."
        ], "«חנה אוכלת סלט» (a salad) but «חנה אוכלת את הסלט» (the salad)."),
        T("t1", "את", "marks a definite direct object", "no English meaning"),
        T("t2", "מסרון", "text message"),
        T("t3", "מתנה", "gift, present"),
        T("t4", "עבודה", "work, assignment"),
        Q("q1", "Fill the blank: «רונית קוראת ___ הספרים»", ["את", "של", "nothing is needed"], 0, "The books are definite (they have «ה»), so «את» goes before them."),
        Q("q2", "Which object makes sense? «דנה שולחת ___»", ["מסרון", "דלת", "חלון"], 0, "You can send a text message. You can't send a door or a window."),
        Q("q3", "«חנה אוכלת את סלט» is correct Hebrew.", TF, 1, "False. After «את» the noun must be definite: «את הסלט». Or drop «את» and say «אוכלת סלט»."),
        Q("q4", "Which object fits? «כולם כותבים את ___»", ["העבודה", "יום שני", "הכיסא"], 0, "Everyone writes the assignment. You don't write Monday or a chair."),
        Q("q5", "Which pair both make sense with «אוכלות»?", ["הסלט and הפסטה", "הסלט and העבודה", "הפסטה and הדלת"], 0, "Salad and pasta are food. An assignment and a door are not.")
      ]),

      lesson("u6-l3", "Prepositions: in, to, from, on, with", [
        E("e1", "The one-letter prepositions", [
          "Three prepositions are a single letter glued to the front of the next word.",
          "«ב» = in, at. «ל» = to, for. «מ» = from.",
          "«בבית» at home. «למורה» to the teacher. «מהבית» from the house."
        ]),
        E("e2", "Verbs that own a preposition", [
          "Some verbs always come with the same preposition. Learn them as one chunk.",
          "«חושב על» thinks about. «מתקשר ל» phones. «אוכל עם» eats with. «כותב ל» writes to."
        ], "«אני חושב על החברה שלי» – I think about my friend."),
        T("t1", "ב", "in, at", "attached to the word: «בבית»"),
        T("t2", "ל", "to, for", "attached to the word: «למורה»"),
        T("t3", "מ", "from", "attached to the word: «מהבית»"),
        T("t4", "על", "on, about", "«חושב על» = thinks about"),
        T("t5", "עם", "with", "«אוכל עם» = eats with"),
        Q("q1", "Fill the blank: «אני חושב ___ החברה שלי»", ["על", "עם", "ב"], 0, "To think about someone is «חושב על»."),
        Q("q2", "Fill the blank: «דני אוכל ארוחת ערב ___ המשפחה שלו»", ["ל", "עם", "מ"], 1, "Eating dinner with the family is «עם המשפחה»."),
        Q("q3", "Fill the blank: «חיים כותב אימייל ___מורה»", ["ב", "על", "ל"], 2, "You write an email to someone: «למורה»."),
        Q("q4", "Fill the blank: «חנה אוהבת ___ דניאל»", ["את", "עם", "על"], 0, "Daniel is a name, so he is definite. Loves Daniel is «אוהבת את דניאל»."),
        Q("q5", "Fill the blank: «דויד בא ___הבית»  (comes from the house)", ["ב", "מ", "ל"], 1, "From is «מ»: «מהבית»."),
        Q("q6", "Fill the blank: «דויד רואה ___ של סופרמן» (sees the Superman movie)", ["את הסרט", "על הסרט", "עם הסרט"], 0, "The movie is a definite object, so it is «את הסרט».")
      ]),

      lesson("u6-l4", "Days of the week", [
        E("e1", "Days are numbered", [
          "Hebrew days don't have names. They are counted, starting from Sunday.",
          "Sunday is \"first day\", Monday is \"second day\", and so on up to Friday, \"sixth day\".",
          "Only «שבת» (Saturday) has its own name."
        ], "«יום ראשון, יום שני, יום שלישי, יום רביעי, יום חמישי, יום שישי, שבת»"),
        E("e2", "Today, tomorrow, yesterday", [
          "«היום» today. «מחר» tomorrow. «אתמול» yesterday.",
          "A test question gives one day and asks you to work out the next or the previous one."
        ], "«היום יום שבת ומחר יום ראשון» – Today is Shabbat and tomorrow is Sunday."),
        T("t1", "יום ראשון", "Sunday", "the first day"),
        T("t2", "יום שני", "Monday", "the second day"),
        T("t3", "יום שלישי", "Tuesday", "the third day"),
        T("t4", "יום רביעי", "Wednesday", "the fourth day"),
        T("t5", "יום חמישי", "Thursday", "the fifth day"),
        T("t6", "יום שישי", "Friday", "the sixth day"),
        T("t7", "שבת", "Shabbat, Saturday"),
        T("t8", "היום", "today"),
        T("t9", "מחר", "tomorrow"),
        T("t10", "אתמול", "yesterday"),
        T("t11", "שבוע", "week"),
        Q("q1", "«היום יום שבת ומחר יום ___»", ["שישי", "ראשון", "שני"], 1, "The day after Shabbat is Sunday, «יום ראשון»."),
        Q("q2", "«אתמול יום שישי והיום יום ___»", ["שבת", "חמישי", "ראשון"], 0, "The day after Friday is Shabbat."),
        Q("q3", "Which day is «יום רביעי»?", ["Tuesday", "Wednesday", "Thursday"], 1, "Fourth day counting from Sunday is Wednesday."),
        Q("q4", "«יום שני» means Sunday.", TF, 1, "False. «שני» is \"second\", so it is Monday. Sunday is «יום ראשון»."),
        Q("q5", "«אתמול יום שלישי. מחר יום ___»", ["רביעי", "חמישי", "שני"], 1, "Yesterday was Tuesday, so today is Wednesday and tomorrow is Thursday, «יום חמישי»."),
        Q("q6", "Which word means yesterday?", ["מחר", "היום", "אתמול"], 2, "«אתמול» is yesterday. «מחר» is tomorrow, «היום» is today.")
      ]),

      lesson("u6-l5", "Putting a sentence in order", [
        E("e1", "The usual order", [
          "A simple Hebrew sentence goes: who, does what, where, when.",
          "Time phrases like \"on Wednesday evening\" usually go last."
        ], "«דויד הולך למסיבה של חנה ביום רביעי בערב» – David goes to Hana's party on Wednesday evening."),
        E("e2", "The verb must match the subject", [
          "When you unscramble a sentence, check the verb ending.",
          "A boy «הולך», a girl «הולכת». If the subject is David, the verb is «הולך»."
        ]),
        T("t1", "בערב", "in the evening"),
        T("t2", "מסיבה", "party"),
        T("t3", "של", "of, belonging to", "«המסיבה של חנה» = Hana's party"),
        Q("q1", "Put these in order: «למסיבה / חנה / ביום / של / רביעי / בערב / הולך / דויד»", ["דויד הולך למסיבה של חנה ביום רביעי בערב", "ביום רביעי בערב למסיבה דויד הולך של חנה", "דויד למסיבה של חנה הולך בערב ביום רביעי"], 0, "Who (David), does what (goes), where (to Hana's party), when (Wednesday evening)."),
        Q("q2", "Fill the blank: «חנה ___ לבית הספר ביום שני»", ["הולך", "הולכת", "הולכים"], 1, "Hana is a girl, so the verb is «הולכת»."),
        Q("q3", "Time phrases usually go at the end of the sentence.", TF, 0, "True. \"On Wednesday evening\" comes last."),
        Q("q4", "Which is the best translation of \"Hana's party\"?", ["מסיבה חנה", "המסיבה של חנה", "חנה של המסיבה"], 1, "Possession uses «של»: the party of Hana.")
      ]),

      lesson("u6-l6", "Question words", [
        E("e1", "Pick the question word from the answer", [
          "If the answer is a person, the question starts with «מי» (who).",
          "If the answer is a place, use «איפה» (where). A time, «מתי» (when). A reason, «למה» (why).",
          "On the test you see the answer and have to write the question word."
        ], "«מי בא למסיבה? דני בא למסיבה.» – Who is coming to the party? Danny is."),
        T("t1", "מי", "who"),
        T("t2", "מה", "what"),
        T("t3", "איפה", "where"),
        T("t4", "מתי", "when"),
        T("t5", "למה", "why"),
        T("t6", "איך", "how"),
        T("t7", "כמה", "how much, how many"),
        Q("q1", "«___ בא למסיבה? דני בא למסיבה.»", ["מה", "מי", "איפה"], 1, "The answer is a person, so the question is who, «מי»."),
        Q("q2", "«___ הכיסא? הכיסא במרכז החדר.»", ["איפה", "מתי", "למה"], 0, "The answer is a place (the middle of the room), so it is where, «איפה»."),
        Q("q3", "«___ המסיבה? המסיבה ביום רביעי.»", ["מי", "איך", "מתי"], 2, "The answer is a day, so the question is when, «מתי»."),
        Q("q4", "«___ עולה הגלידה? עשרה שקלים.»", ["כמה", "מה", "למה"], 0, "A price answers how much, «כמה»."),
        Q("q5", "«למה» means where.", TF, 1, "False. «למה» is why. Where is «איפה».")
      ]),

      lesson("u6-l7", "Plurals", [
        E("e1", "Two main plural endings", [
          "Most masculine nouns add «ים-» at the end: «משחק» becomes «משחקים».",
          "Most feminine nouns end in «ה-», and that «ה» becomes «ות-»: «הפתעה» becomes «הפתעות».",
          "Test tip: look at the last letter. Ending in «ה»? Probably «ות». Otherwise, probably «ים»."
        ]),
        T("t1", "משחקים", "games", "plural of «משחק»"),
        T("t2", "כוכבים", "stars", "plural of «כוכב»"),
        T("t3", "הפתעות", "surprises", "plural of «הפתעה»"),
        Q("q1", "Plural of «משחק» (game)?", ["משחקות", "משחקים", "משחקה"], 1, "Masculine noun, add «ים»: «משחקים»."),
        Q("q2", "Plural of «הפתעה» (surprise)?", ["הפתעים", "הפתעות", "הפתעהים"], 1, "It ends in «ה», so «ה» turns into «ות»: «הפתעות»."),
        Q("q3", "Plural of «כוכב» (star)?", ["כוכבים", "כוכבות", "כוכב"], 0, "Masculine, add «ים»: «כוכבים»."),
        Q("q4", "The plural of «מסיבה» (party) is «מסיבות».", TF, 0, "True. It ends in «ה», so the plural ending is «ות»."),
        Q("q5", "Plural of «נר» (candle)?", ["נרות", "נרים", "נרה"], 0, "Watch out: «נר» is one of the exceptions. Its plural is «נרות».")
      ]),

      lesson("u6-l8", "Present-tense verbs", [
        E("e1", "Four forms, one for each subject", [
          "A present-tense verb changes to match who is doing it: he, she, they (boys or mixed), they (girls).",
          "«עושה» (does, makes): he «עושה», she «עושה», they «עושים», girls «עושות».",
          "For this verb, he and she look the same. Most other verbs add «ת» for she."
        ], "«דויד עושה שיעורי בית. חנה ורחל עושות שיעורי בית.»"),
        E("e2", "The regular pattern", [
          "Take «לומד» (studies): he «לומד», she «לומדת», they «לומדים», girls «לומדות».",
          "«ים» for a group with at least one boy. «ות» for a group of girls only."
        ]),
        T("t1", "עושה", "does, makes (he / she)"),
        T("t2", "עושים", "do, make (they, masculine or mixed)"),
        T("t3", "עושות", "do, make (they, feminine)"),
        T("t4", "שיעורי בית", "homework"),
        T("t5", "תלמידים", "students"),
        Q("q1", "«חנה ורחל ___ שיעורי בית»", ["עושה", "עושים", "עושות"], 2, "Hana and Rachel are two girls, so «עושות»."),
        Q("q2", "«התלמידים ___ שיעורי בית»", ["עושים", "עושות", "עושה"], 0, "The students (masculine plural) take «עושים»."),
        Q("q3", "«דויד ___ שיעורי בית»", ["עושים", "עושה", "עושות"], 1, "One boy: «עושה»."),
        Q("q4", "«הבנות ___ בבית הספר» (the girls study)", ["לומדות", "לומדים", "לומדת"], 0, "A group of girls takes «ות»: «לומדות»."),
        Q("q5", "«עושים» is used only for a group of girls.", TF, 1, "False. «עושים» is for boys or a mixed group. Girls only is «עושות»."),
        Q("q6", "«רחל ___ בבית הספר» (Rachel studies)", ["לומד", "לומדת", "לומדות"], 1, "One girl: add «ת», «לומדת».")
      ]),

      lesson("u6-l9", "Reading and writing an answer", [
        E("e1", "What the reading section looks like", [
          "You get a short passage, a few questions about it, and one open question about you.",
          "Underline the question word first: «מי», «מה», «איפה», «מתי», «למה». It tells you what kind of answer to look for.",
          "Answer in a full sentence, reusing words from the question."
        ]),
        E("e2", "The open question", [
          "The practice question was: what do you most like to eat, on which day, what is special about it, and why.",
          "Build four short sentences: «אני הכי אוהב לאכול…», «ביום…», «האוכל הזה מיוחד כי…»",
          "Girls say «אוהבת», boys say «אוהב»."
        ], "«אני הכי אוהבת לאכול פיצה ביום שישי. זה מיוחד כי כל המשפחה אוכלת ביחד.»"),
        T("t1", "הכי", "the most", "«הכי אוהב» = like the most"),
        T("t2", "מיוחד", "special"),
        T("t3", "רגיל", "ordinary, regular"),
        T("t4", "כי", "because"),
        T("t5", "ביחד", "together"),
        Q("q1", "«אני ___ אוהב לאכול פיצה» (I like pizza the most)", ["הכי", "רק", "כל כך"], 0, "The most is «הכי»."),
        Q("q2", "Which answer fits the question «למה?»", ["כי זה טעים", "ביום שישי", "פיצה"], 0, "Why gets a because answer: «כי זה טעים», because it is tasty."),
        Q("q3", "The opposite of «מיוחד» (special) is:", ["רגיל", "שמח", "מעניין"], 0, "«רגיל» means ordinary or regular."),
        Q("q4", "A girl writes «אני אוהב לאכול גלידה».", TF, 1, "False. A girl uses the feminine form «אוהבת».")
      ]),

      lesson("u6-l10", "Vocabulary: food and celebrations", [
        E("e1", "How to use these cards", [
          "Tap a card to reveal the meaning. Say the word out loud before you tap.",
          "Then try the quick checks at the end. Missed ones come back a few cards later."
        ]),
        T("t1", "אוכל", "food"),
        T("t2", "גלידה", "ice cream"),
        T("t3", "מיץ", "juice"),
        T("t4", "זית", "olive"),
        T("t5", "ברכה", "blessing, greeting"),
        T("t6", "הפתעה", "surprise"),
        T("t7", "יום הולדת", "birthday"),
        T("t8", "מסיבה", "party"),
        T("t9", "נר", "candle"),
        T("t10", "שיר", "song"),
        T("t11", "משחק", "game"),
        T("t12", "חוג", "club, after-school activity"),
        T("t13", "מילון", "dictionary"),
        T("t14", "שעון", "clock, watch"),
        Q("q1", "What is «גלידה»?", ["juice", "ice cream", "olive"], 1, "«גלידה» is ice cream. Juice is «מיץ»."),
        Q("q2", "Which word means birthday?", ["יום הולדת", "יום שני", "מסיבה"], 0, "«יום הולדת» is birthday. «מסיבה» is party."),
        Q("q3", "What is a «חוג»?", ["a candle", "a club or after-school activity", "a song"], 1, "A «חוג» is a club or extra class, like soccer or art after school."),
        Q("q4", "«מילון» means clock.", TF, 1, "False. «מילון» is dictionary. Clock is «שעון»."),
        Q("q5", "Which word means surprise?", ["הפתעה", "ברכה", "שיר"], 0, "«הפתעה» is surprise. «ברכה» is blessing, «שיר» is song.")
      ]),

      lesson("u6-l11", "Vocabulary: sky, nature and describing", [
        T("t1", "שמיים", "sky"),
        T("t2", "כוכב", "star"),
        T("t3", "ירח", "moon"),
        T("t4", "חושך", "darkness"),
        T("t5", "חיה", "animal"),
        T("t6", "צמח", "plant"),
        T("t7", "דלת", "door"),
        T("t8", "סדר", "order, tidiness", "also the Passover Seder"),
        T("t9", "מישהו", "someone"),
        T("t10", "מעניין", "interesting"),
        T("t11", "מצוין", "excellent"),
        T("t12", "רגיל", "ordinary, regular"),
        T("t13", "שמח", "happy"),
        Q("q1", "What is «ירח»?", ["star", "moon", "sky"], 1, "«ירח» is moon. Star is «כוכב», sky is «שמיים»."),
        Q("q2", "Which word means animal?", ["צמח", "חיה", "חושך"], 1, "«חיה» is animal. «צמח» is plant, «חושך» is darkness."),
        Q("q3", "«מצוין» means ordinary.", TF, 1, "False. «מצוין» is excellent. Ordinary is «רגיל»."),
        Q("q4", "Which word means someone?", ["מישהו", "שמח", "סדר"], 0, "«מישהו» is someone."),
        Q("q5", "Pick the word for interesting.", ["שמח", "מעניין", "רגיל"], 1, "«מעניין» is interesting. «שמח» is happy.")
      ]),

      lesson("u6-l12", "Vocabulary: verbs and useful words", [
        T("t1", "זוכר", "remembers"),
        T("t2", "מבין", "understands"),
        T("t3", "שואל", "asks (a question)"),
        T("t4", "שולח", "sends"),
        T("t5", "מתקשר ל", "phones, calls (someone)"),
        T("t6", "בורא", "creates"),
        T("t7", "תגיד / תגידי", "say!, tell!", "«תגיד» to a boy, «תגידי» to a girl"),
        T("t8", "לפני", "before"),
        T("t9", "אחרי", "after"),
        T("t10", "חוץ לארץ", "abroad, outside the country"),
        T("t11", "רק רגע!", "just a moment!"),
        T("t12", "שום דבר", "nothing"),
        Q("q1", "What does «זוכר» mean?", ["understands", "remembers", "asks"], 1, "«זוכר» is remembers. «מבין» is understands."),
        Q("q2", "Which word means after?", ["לפני", "אחרי", "אתמול"], 1, "«אחרי» is after. «לפני» is before."),
        Q("q3", "«שום דבר» means something.", TF, 1, "False. «שום דבר» is nothing."),
        Q("q4", "How do you say \"phones the teacher\"?", ["מתקשר למורה", "שולח למורה", "שואל למורה"], 0, "To phone someone is «מתקשר ל»."),
        Q("q5", "«חוץ לארץ» means:", ["at home", "abroad", "in the city"], 1, "«חוץ לארץ» literally means \"outside the land\", so abroad."),
        Q("q6", "You are talking to a girl. Which is right?", ["תגיד", "תגידי"], 1, "«תגידי» is the feminine form.")
      ])
    ]
  };

  var u7 = {
    id: "u7",
    short: "Unit 7",
    title: "Unit 7 · The house, furniture and colours",
    lessons: [
      lesson("u7-l1", "Rooms of the house", [
        E("e1", "Walking through a home", [
          "A «דירה» is an apartment. Inside it you find the «מטבח» (kitchen), the «סלון» (living room) and the «חדר אוכל» (dining room).",
          "The bathroom has a few words: «אמבטיה» is the bath, «מקלחת» is the shower, «שירותים» is the toilet.",
          "Rooms are made of «קיר» (wall), «חלון» (window) and «דלת» (door)."
        ]),
        T("t1", "דירה", "apartment"),
        T("t2", "מטבח", "kitchen"),
        T("t3", "סלון", "living room"),
        T("t4", "חדר אוכל", "dining room"),
        T("t5", "אמבטיה", "bath, bathtub"),
        T("t6", "מקלחת", "shower"),
        T("t7", "שירותים", "toilet, washroom"),
        T("t8", "חלון", "window"),
        T("t9", "קיר", "wall"),
        T("t10", "ארמון", "palace"),
        Q("q1", "Where do you cook?", ["סלון", "מטבח", "מקלחת"], 1, "The kitchen is «מטבח»."),
        Q("q2", "What is «סלון»?", ["living room", "dining room", "bedroom"], 0, "«סלון» is the living room. Dining room is «חדר אוכל»."),
        Q("q3", "«שירותים» means shower.", TF, 1, "False. «שירותים» is the toilet. Shower is «מקלחת»."),
        Q("q4", "Which word means window?", ["קיר", "חלון", "דלת"], 1, "«חלון» is window. «קיר» is wall, «דלת» is door."),
        Q("q5", "A king lives in a:", ["ארמון", "דירה", "חדר אוכל"], 0, "«ארמון» is a palace.")
      ]),

      lesson("u7-l2", "Furniture and things at home", [
        E("e1", "Things in a room", [
          "To sleep you need a «מיטה» (bed). To sit, a «כיסא» (chair) or «ספה» (sofa).",
          "Books go on a «מדף» (shelf), clothes in an «ארון» (closet). On the floor, a «שטיח» (rug). On the wall, a «ציור» (picture) or «ראי» (mirror)."
        ]),
        T("t1", "מיטה", "bed"),
        T("t2", "כיסא", "chair"),
        T("t3", "ספה", "sofa"),
        T("t4", "מדף", "shelf"),
        T("t5", "ארון", "closet, cupboard"),
        T("t6", "שטיח", "rug, carpet"),
        T("t7", "ראי", "mirror"),
        T("t8", "ציור", "drawing, picture"),
        T("t9", "אור", "light"),
        T("t10", "פרח", "flower"),
        T("t11", "עץ", "tree, wood"),
        Q("q1", "You put books on a:", ["מדף", "מיטה", "שטיח"], 0, "«מדף» is a shelf."),
        Q("q2", "What is «ארון»?", ["sofa", "closet", "mirror"], 1, "«ארון» is a closet or cupboard."),
        Q("q3", "«ראי» means rug.", TF, 1, "False. «ראי» is a mirror. Rug is «שטיח»."),
        Q("q4", "Which word means sofa?", ["כיסא", "ספה", "ציור"], 1, "«ספה» is sofa. «כיסא» is chair."),
        Q("q5", "«עץ» can mean both:", ["tree and wood", "flower and plant", "light and lamp"], 0, "«עץ» is a tree, and also the material wood.")
      ]),

      lesson("u7-l3", "Colours", [
        E("e1", "Colours are adjectives", [
          "A colour comes after the noun, not before: «בית לבן» is \"a white house\".",
          "The colour matches the noun. A masculine noun gets the plain form, a feminine noun adds «ה»: «מכונית לבנה» (a white car).",
          "Test tip: the teacher said all the colours are on the test."
        ]),
        T("t1", "צבע", "colour"),
        T("t2", "אדום", "red"),
        T("t3", "כחול", "blue"),
        T("t4", "ירוק", "green"),
        T("t5", "צהוב", "yellow"),
        T("t6", "לבן", "white"),
        T("t7", "שחור", "black"),
        T("t8", "ורוד", "pink"),
        T("t9", "סגול", "purple"),
        E("e2", "Three more colours to know", [
          "These were not in the vocabulary table, but \"all the colours\" may include them.",
          "«חום» brown. «כתום» orange. «אפור» grey."
        ]),
        T("t10", "חום", "brown"),
        T("t11", "כתום", "orange"),
        T("t12", "אפור", "grey"),
        Q("q1", "What colour is «ירוק»?", ["green", "yellow", "blue"], 0, "«ירוק» is green."),
        Q("q2", "Which word means purple?", ["ורוד", "סגול", "אדום"], 1, "«סגול» is purple. «ורוד» is pink."),
        Q("q3", "«שחור» means white.", TF, 1, "False. «שחור» is black. White is «לבן»."),
        Q("q4", "A white house is:", ["לבן בית", "בית לבן", "בית לבנה"], 1, "The colour comes after the noun, and house is masculine, so «בית לבן»."),
        Q("q5", "Which word means yellow?", ["צהוב", "כחול", "כתום"], 0, "«צהוב» is yellow. «כחול» is blue, «כתום» is orange."),
        Q("q6", "The sky on a clear day is:", ["כחול", "אדום", "חום"], 0, "The sky is blue, «כחול».")
      ]),

      lesson("u7-l4", "Describing things", [
        E("e1", "Adjectives for your room", [
          "A room can be «נוח» (comfortable), «נחמד» (nice), «מודרני» (modern) or «ישן» (old).",
          "If everything is upside down it is «הפוך». If it is a mess, it is a «בלגן».",
          "Slang the textbook uses: «משוגע» (crazy) and «עשר» (\"a ten\", meaning great)."
        ]),
        T("t1", "נוח", "comfortable"),
        T("t2", "נחמד", "nice"),
        T("t3", "מודרני", "modern"),
        T("t4", "ישן", "old (for things)"),
        T("t5", "חשוב", "important"),
        T("t6", "קשה", "hard, difficult"),
        T("t7", "הפוך", "upside down, reversed"),
        T("t8", "בלגן", "a mess", "slang"),
        T("t9", "משוגע", "crazy", "slang"),
        Q("q1", "What does «נוח» mean?", ["nice", "comfortable", "modern"], 1, "«נוח» is comfortable. «נחמד» is nice."),
        Q("q2", "Which word means old, for a thing like a chair?", ["ישן", "קשה", "חשוב"], 0, "«ישן» is old for objects."),
        Q("q3", "«בלגן» means tidy.", TF, 1, "False. «בלגן» is a mess. Tidy or order is «סדר»."),
        Q("q4", "Which word means important?", ["הפוך", "חשוב", "משוגע"], 1, "«חשוב» is important."),
        Q("q5", "The test was «קשה». That means it was:", ["easy", "hard", "short"], 1, "«קשה» is hard or difficult.")
      ]),

      lesson("u7-l5", "People, time and everyday things", [
        T("t1", "אח", "brother"),
        T("t2", "אחות", "sister"),
        T("t3", "בן", "son, boy"),
        T("t4", "בת", "daughter, girl"),
        T("t5", "הורה", "parent"),
        T("t6", "זמן", "time"),
        T("t7", "חודש", "month"),
        T("t8", "חג", "holiday"),
        T("t9", "דבר", "thing"),
        T("t10", "כסף", "money"),
        T("t11", "אמת", "truth"),
        T("t12", "אחוז", "percent"),
        T("t13", "ציון", "grade, mark"),
        T("t14", "פרסומת", "advertisement"),
        Q("q1", "What is «אחות»?", ["brother", "sister", "daughter"], 1, "«אחות» is sister. «אח» is brother."),
        Q("q2", "Which word means month?", ["שבוע", "חודש", "חג"], 1, "«חודש» is month. «שבוע» is week, «חג» is holiday."),
        Q("q3", "«ציון» means money.", TF, 1, "False. «ציון» is a grade or mark. Money is «כסף»."),
        Q("q4", "Which word means parent?", ["הורה", "בן", "אח"], 0, "«הורה» is parent."),
        Q("q5", "«אמת» means:", ["truth", "time", "thing"], 0, "«אמת» is truth. Time is «זמן», thing is «דבר».")
      ]),

      lesson("u7-l6", "Verbs around the house", [
        E("e1", "Verbs for tidying and buying", [
          "«מסדר» tidies, «שם» puts, «זורק» throws, «מוצא» finds.",
          "«מוכר» sells, «משלם» pays, «מבקש» asks for, «מזמין» invites or orders.",
          "All of these are the \"he\" form. Add «ת» for she, «ים» for they."
        ], "«אמא מסדרת את הסלון» – Mum tidies the living room."),
        T("t1", "מסדר", "tidies, arranges"),
        T("t2", "שם", "puts"),
        T("t3", "זורק", "throws"),
        T("t4", "מוצא", "finds"),
        T("t5", "מוכר", "sells"),
        T("t6", "משלם", "pays"),
        T("t7", "מבקש", "asks for, requests"),
        T("t8", "מזמין", "invites, orders"),
        T("t9", "מספר", "tells (a story), counts"),
        T("t10", "מצייר", "draws"),
        T("t11", "צובע", "paints, colours in"),
        T("t12", "עובר", "passes, moves (house)"),
        T("t13", "שומר", "guards, keeps"),
        T("t14", "שונא", "hates"),
        Q("q1", "What does «מוכר» mean?", ["buys", "sells", "pays"], 1, "«מוכר» is sells. Pays is «משלם»."),
        Q("q2", "Which verb means finds?", ["מוצא", "מזמין", "זורק"], 0, "«מוצא» is finds."),
        Q("q3", "«מבקש» means asks a question.", TF, 1, "False. «מבקש» is asks for something, requests. Asking a question is «שואל»."),
        Q("q4", "«הם ___ את הבית» (they paint the house)", ["צובע", "צובעים", "צובעת"], 1, "They is plural: «צובעים»."),
        Q("q5", "Which verb means hates?", ["שומר", "שונא", "שם"], 1, "«שונא» is hates."),
        Q("q6", "«מזמין» can mean both:", ["invites and orders", "sells and buys", "throws and finds"], 0, "«מזמין» is invites someone, and also orders food or a product.")
      ]),

      lesson("u7-l7", "Useful expressions", [
        E("e1", "Small words that carry a lot", [
          "«בדיוק» exactly. «בערך» about, roughly. «למשל» for example. «לפי» according to.",
          "«כל כך» so (as in \"so big\"). «כזה» such a, like this. «אף פעם» never. «לבד» alone.",
          "To ask a price: «כמה עולה…?» How much does … cost?"
        ], "«כמה עולה הספה? בערך אלף שקל.» – How much is the sofa? About a thousand shekels."),
        T("t1", "בדיוק", "exactly"),
        T("t2", "בערך", "about, approximately"),
        T("t3", "למשל", "for example"),
        T("t4", "לפי", "according to"),
        T("t5", "כל כך", "so, so much"),
        T("t6", "כזה", "such a, like this"),
        T("t7", "אף פעם", "never"),
        T("t8", "לבד", "alone"),
        T("t9", "מחדש", "again, from the start"),
        T("t10", "חבל ש", "it's a pity that"),
        T("t11", "כמה עולה…?", "how much does … cost?"),
        T("t12", "שניים", "two"),
        T("t13", "עשר", "ten; slang for \"great\""),
        Q("q1", "«בערך» means:", ["exactly", "about, roughly", "never"], 1, "«בערך» is about or roughly. Exactly is «בדיוק»."),
        Q("q2", "Which phrase means never?", ["אף אחד", "אף פעם", "שום דבר"], 1, "«אף פעם» is never. «אף אחד» is no one, «שום דבר» is nothing."),
        Q("q3", "«לבד» means together.", TF, 1, "False. «לבד» is alone. Together is «ביחד»."),
        Q("q4", "How do you ask what something costs?", ["כמה עולה?", "מתי עולה?", "איפה עולה?"], 0, "«כמה עולה?» is how much does it cost."),
        Q("q5", "«החדר כל כך נחמד» means the room is:", ["a bit nice", "so nice", "not nice"], 1, "«כל כך» means so, so much."),
        Q("q6", "Which word means for example?", ["לפי", "למשל", "מחדש"], 1, "«למשל» is for example. «לפי» is according to.")
      ])
    ]
  };

  window.COURSE_DATA = {
    code: COURSE,
    title: "Ivrit",
    subtitle: "Grade 9 Hebrew",
    units: [u6, u7]
  };
})();
