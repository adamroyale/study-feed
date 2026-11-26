/* CGC1W – Issues in Canadian Geography card decks.
   Rules: every card id is stable and never reused. New cards go at the END of a lesson's list.
   Card types:
     E(id, title, [lines], example)         explainer
     T(id, term, definition, note)          key term, tap to reveal
     Q(id, question, [options], answerIdx, why)   quick check (multiple choice or true/false)
*/
(function () {
  var COURSE = "cgc1w";
  function E(id, title, lines, example) { return { type: "explain", id: id, title: title, lines: lines, example: example || "" }; }
  function T(id, term, def, note) { return { type: "term", id: id, term: term, def: def, note: note || "" }; }
  function Q(id, q, options, answer, why) { return { type: "quiz", id: id, q: q, options: options, answer: answer, why: why }; }
  var TF = ["True", "False"];

  function lesson(id, title, cards) {
    cards.forEach(function (c) { c.id = COURSE + "-" + id + "-" + c.id; });
    return { id: id, title: title, cards: cards };
  }

  /* Unit number not yet known from the material; "eq" is a stable id for this unit. */
  var eq = {
    id: "eq",
    short: "Communities and equity",
    title: "Communities and equity in Canada",
    lessons: [
      lesson("eq-l1", "Anti-Black racism: the history", [
        E("e1", "Why a geography class looks at racism", [
          "Geography is about where people live and why. Where a community sits affects the roads, water, schools, jobs and services its people can reach.",
          "Those locations were often decided long ago, sometimes by rules that treated people unequally. So today's map still carries yesterday's decisions."
        ]),
        E("e2", "Slavery happened in Canada", [
          "People were enslaved in New France and later in British North America, the colonies that became Canada. Both Black and Indigenous people were held as property.",
          "Slavery was abolished across the British Empire in 1834. Before that, Upper Canada (now Ontario) passed a law in 1793 that stopped new enslaved people being brought in but did not free those already here."
        ], "A common myth says Canada was only ever a refuge from slavery. It was a place of slavery first."),
        E("e3", "The Underground Railroad", [
          "In the 1800s a secret network of safe houses and guides helped people escape slavery in the United States.",
          "After 1834 British North America was free territory, so tens of thousands of freedom seekers travelled north. Many settled in what is now southern Ontario, in places like Chatham, Buxton and Dresden."
        ], "Harriet Tubman lived in St. Catharines, Ontario, for several years while guiding people to freedom."),
        E("e4", "Separate schools", [
          "In 1850 Ontario's Common Schools Act allowed school boards to set up separate schools for Black students. Many did, and Black families were kept out of the regular school.",
          "The last segregated school in Ontario closed in 1965. In Nova Scotia the last one closed in 1983. That is within your grandparents' lifetime."
        ]),
        E("e5", "Africville: location and services", [
          "Africville was a Black community on the edge of Halifax, Nova Scotia, founded in the 1800s. Residents paid taxes but the city never gave them running water, sewers or paved roads.",
          "Instead the city placed a dump, a prison and an infectious-disease hospital next to it. In the 1960s the city demolished Africville and moved the residents out. Halifax apologized in 2010."
        ], "This is the clearest Canadian example of a neighbourhood not getting the same services as the rest of a city."),
        T("t1", "Abolition", "the ending of slavery by law", "across the British Empire in 1834"),
        T("t2", "Underground Railroad", "a secret network that helped people escape slavery in the United States, many reaching Canada", "not an actual railway"),
        T("t3", "Freedom seeker", "a person escaping slavery", "the term used instead of \"runaway slave\""),
        T("t4", "Segregation", "keeping groups of people apart by law or by practice, for example in separate schools"),
        T("t5", "Africville", "a Black community in Halifax that was denied city services and demolished in the 1960s"),
        T("t6", "Black Loyalists", "Black people who sided with Britain in the American Revolution and settled in Nova Scotia in the 1780s", "the first large Black settlement in Canada"),
        Q("q1", "Slavery never happened in Canada.", TF, 1, "False. People were enslaved in New France and British North America until abolition in 1834."),
        Q("q2", "The Underground Railroad brought some Black newcomers to Canada.", TF, 0, "True. After 1834 Canada was free territory, and tens of thousands of freedom seekers came north."),
        Q("q3", "In some parts of Canada, Black students did not always attend the same schools as white students.", TF, 0, "True. Ontario allowed separate schools from 1850, and the last one closed in 1965."),
        Q("q4", "When did slavery end across the British Empire, including Canada?", ["1793", "1834", "1965"], 1, "1834. The 1793 Upper Canada law only stopped new enslaved people arriving. 1965 is when Ontario's last segregated school closed."),
        Q("q5", "Africville was demolished because:", ["the residents asked to move", "the city chose to clear it after years of denying it services", "it was destroyed by a flood"], 1, "Halifax cleared Africville in the 1960s after decades of refusing it water, sewers and roads. The city apologized in 2010."),
        Q("q6", "The Underground Railroad was a real railway with trains and tracks.", TF, 1, "False. It was a code name for a network of people, routes and safe houses.")
      ]),

      lesson("eq-l2", "Systemic racism and where we live", [
        E("e1", "Systemic racism", [
          "Racism isn't only one person being unfair to another. It can be built into rules, habits and systems, so that a group gets worse results even when no single person means to discriminate.",
          "Example: if a school board placed Black students in separate, poorly funded schools, every student in those schools was affected, whatever each teacher personally believed."
        ]),
        E("e2", "Not every neighbourhood got the same", [
          "Services like clean water, transit, parks and good schools were not spread evenly across Canadian cities. Some communities were ignored or pushed to the edges.",
          "Where a family was allowed or able to live shaped the jobs they could reach, the schools their kids attended and the value of their home."
        ], "Africville paid city taxes for decades without receiving city water."),
        E("e3", "The past shapes the present", [
          "Decisions made many years ago, about who could live where, go to which school or get which job, still show up today as gaps in income, housing and health.",
          "That is why saying \"Canada has no racism\" doesn't match what many communities experience. The rules changed, but their effects didn't vanish overnight."
        ]),
        E("e4", "Equality and equity", [
          "Equality means giving everyone the same thing. Equity means giving people what they need to reach the same outcome.",
          "If one neighbourhood started with no running water, giving every neighbourhood the same small budget keeps the gap. Equity means closing it."
        ]),
        T("t1", "Systemic racism", "unequal treatment or results built into rules, institutions and everyday practices, not just individual attitudes"),
        T("t2", "Discrimination", "treating a person or group worse because of who they are"),
        T("t3", "Equity", "giving people what they need to reach a fair outcome", "not the same as equality"),
        T("t4", "Equality", "treating everyone exactly the same"),
        T("t5", "Community services", "things a city or town provides to the people who live there: water, sewers, roads, transit, schools, parks"),
        T("t6", "Inequality", "a gap between groups in things like income, housing, health or education"),
        Q("q1", "Where a community is located can affect the resources available to the people who live there.", TF, 0, "True. Location decides which roads, transit, schools, jobs and services are within reach."),
        Q("q2", "Systemic racism can exist even when individuals don't intend to discriminate.", TF, 0, "True. It lives in rules and systems, so results can be unequal without anyone meaning harm."),
        Q("q3", "All neighbourhoods in Canada have always received the same level of services and support.", TF, 1, "False. Africville is one example of a community that paid taxes and was denied basic services."),
        Q("q4", "Everyone in Canada's past had equal access to opportunities like education and jobs.", TF, 1, "False. Segregated schools and job discrimination limited what Black Canadians could access."),
        Q("q5", "Some inequalities today can be connected to decisions made many years ago.", TF, 0, "True. Where people were allowed to live and study shaped the income, housing and health gaps we see now."),
        Q("q6", "Canada is sometimes described as a country without racism today, but this idea doesn't always match the experiences of all communities.", TF, 0, "True. Many Black Canadians and other communities still report unequal treatment, so the \"no racism\" picture is incomplete."),
        Q("q7", "Giving every neighbourhood the exact same budget, no matter what it already has, is an example of:", ["equity", "equality", "segregation"], 1, "That is equality: the same for everyone. Equity would give more to the neighbourhood that started with less."),
        Q("q8", "Which is the best example of systemic racism?", ["one student insulting another", "a rule that places Black students in separate, underfunded schools", "a disagreement between neighbours"], 1, "A rule that affects a whole group through the school system is systemic. The others are individual acts.")
      ])
    ]
  };

  window.COURSE_DATA = {
    code: COURSE,
    title: "Issues in Canadian Geography",
    subtitle: "Grade 9 Geography",
    units: [eq]
  };
})();
