/* MTH1W – Principles of Mathematics card decks.
   Rules: every card id is stable and never reused. New cards go at the END of a lesson's list.
   Card types:
     E(id, title, [lines], example)         explainer
     T(id, term, definition, note)          key term, tap to reveal
     Q(id, question, [options], answerIdx, why)   quick check (multiple choice or true/false)
   Math is written in plain text with Unicode superscripts (x², x³) and a real minus sign (−).
*/
(function () {
  var COURSE = "mth1w";
  function E(id, title, lines, example) { return { type: "explain", id: id, title: title, lines: lines, example: example || "" }; }
  function T(id, term, def, note) { return { type: "term", id: id, term: term, def: def, note: note || "" }; }
  function Q(id, q, options, answer, why) { return { type: "quiz", id: id, q: q, options: options, answer: answer, why: why }; }
  var TF = ["True", "False"];

  function lesson(id, title, cards) {
    cards.forEach(function (c) { c.id = COURSE + "-" + id + "-" + c.id; });
    return { id: id, title: title, cards: cards };
  }

  var u3 = {
    id: "u3",
    short: "Unit 3 · Polynomials",
    title: "Unit 3 – Polynomials",
    lessons: [
      lesson("u3-l1", "Introduction to polynomials", [
        E("e1", "What a term is", [
          "A term is a number, a variable, or numbers and variables multiplied together.",
          "A term has two parts: the coefficient (the number in front) and the variable or variables."
        ], "In 7x, the coefficient is 7 and the variable is x. In −3.5x², the coefficient is −3.5."),
        E("e2", "Constants", [
          "A term with no variable at all is a constant. It never changes value, which is where the name comes from.",
          "In 5x² + 2y − 7, the constant is −7."
        ]),
        E("e3", "Degree of a term", [
          "Add up the exponents on all the variables in the term. That total is the degree.",
          "5x has degree 1. 2y² has degree 2. b²c³ has degree 2 + 3 = 5. A constant has degree 0."
        ], "A variable with no exponent written has exponent 1."),
        E("e4", "What a polynomial is", [
          "A polynomial is one or more terms joined by + or − signs. Count the terms by counting the pieces between the signs.",
          "2x² − 3xy² + 4y² − 5xy − 6 has five terms."
        ]),
        E("e5", "Monomial, binomial, trinomial", [
          "One term: monomial, like 7m². Two terms: binomial, like 5k − 3. Three terms: trinomial, like 10x² − 6x + 1.",
          "With four or more terms we just say polynomial."
        ], "Mono = one, bi = two, tri = three, like monorail, bicycle and tricycle."),
        E("e6", "Degree of a polynomial", [
          "Find the degree of each term. The biggest one is the degree of the whole polynomial.",
          "In 2x² − 3xy² + 4y² − 5xy − 6x³yz the term degrees are 2, 3, 2, 2 and 5, so the polynomial has degree 5."
        ]),
        E("e7", "Like terms", [
          "Like terms have exactly the same variables with exactly the same exponents. Only the coefficients can differ.",
          "3x² and x² are like terms. 8x and 7x³ are not (different exponents). 4x and 24 are not (one has no variable)."
        ], "Only like terms can be added or subtracted."),
        E("e8", "Descending order", [
          "Write the terms so the exponents go from highest to lowest. The constant goes last.",
          "1 + x³ + 2x + 4x² becomes x³ + 4x² + 2x + 1."
        ]),
        T("t1", "Term", "a number, a variable, or numbers and variables multiplied together", "7x, −3.5x², 8"),
        T("t2", "Coefficient", "the number in front of the variable in a term", "in 7x it is 7"),
        T("t3", "Variable", "a letter that stands for a number that can change", "x, y, m"),
        T("t4", "Constant", "a term with no variable; its value never changes", "the −7 in 5x² + 2y − 7"),
        T("t5", "Degree of a term", "the sum of the exponents on its variables", "b²c³ has degree 5"),
        T("t6", "Degree of a polynomial", "the highest degree of any of its terms"),
        T("t7", "Monomial", "a polynomial with one term", "7m²"),
        T("t8", "Binomial", "a polynomial with two terms", "5k − 3"),
        T("t9", "Trinomial", "a polynomial with three terms", "10x² − 6x + 1"),
        T("t10", "Like terms", "terms with the same variables and the same exponents", "3x² and x²"),
        T("t11", "Expression", "numbers, variables and operations put together, with no equals sign", "2x + 3 is an expression; 2x + 3 = 7 is an equation"),
        Q("q1", "In the term −3.5x², the coefficient is:", ["−3.5", "2", "x"], 0, "The coefficient is the number in front: −3.5. The 2 is the exponent and x is the variable."),
        Q("q2", "The degree of b²c³ is:", ["2", "3", "5"], 2, "Add the exponents: 2 + 3 = 5."),
        Q("q3", "How many terms does 2x² − 3xy² + 4y² − 5xy − 6 have?", ["3", "4", "5"], 2, "Count the pieces between the + and − signs: 2x², 3xy², 4y², 5xy, 6. Five terms."),
        Q("q4", "5k − 3 is a:", ["monomial", "binomial", "trinomial"], 1, "Two terms (5k and 3) make a binomial."),
        Q("q5", "Which pair are like terms?", ["3x² and x²", "8x and 7x³", "4x and 24"], 0, "Like terms need the same variable with the same exponent. Only 3x² and x² match."),
        Q("q6", "The degree of −7a³ − 7a² + a + 1 is:", ["1", "3", "4"], 1, "The highest exponent on a is 3, so the degree is 3. Don't count the number of terms."),
        Q("q7", "A constant term like 8 has degree:", ["0", "1", "no degree"], 0, "No variable means no exponents to add, so the degree is 0."),
        Q("q8", "Which is written in descending order?", ["2x + 3x² − 1", "3x² + 2x − 1", "−1 + 2x + 3x²"], 1, "Highest exponent first: 3x², then 2x, then the constant."),
        Q("q9", "9v³ and v are like terms.", TF, 1, "False. The exponents differ (3 and 1), so they cannot be combined."),
        Q("q10", "7m² is a monomial of degree 2.", TF, 0, "True. One term, and the exponent on m is 2.")
      ]),

      lesson("u3-l2", "Adding and subtracting polynomials", [
        E("e1", "The one rule", [
          "You can only add or subtract like terms. Add or subtract the coefficients; the variable and its exponent stay exactly the same.",
          "3x + 10 + 2x + 4 = 5x + 14. The x terms combine, the numbers combine, and they stay separate from each other."
        ], "x² + x cannot be simplified. They are not like terms."),
        E("e2", "Collect like terms step by step", [
          "Circle or highlight the like terms first so nothing gets lost. Then combine each group.",
          "8y² − 5y − 10y² + 4y: the y² terms give 8 − 10 = −2, the y terms give −5 + 4 = −1. Answer: −2y² − y."
        ]),
        E("e3", "A plus in front of a bracket", [
          "A + before a bracket changes nothing inside. Just drop the bracket and collect like terms.",
          "(5x + 9) + (2x − 12) = 5x + 9 + 2x − 12 = 7x − 3."
        ]),
        E("e4", "A minus in front of a bracket", [
          "A − before a bracket flips the sign of every term inside.",
          "(11y + m) − (6y + 4m) = 11y + m − 6y − 4m = 5y − 3m."
        ], "Why? m − (7 + 5) = m − 12, and m − 7 − 5 is also m − 12. Subtracting the group means subtracting each piece."),
        E("e5", "Careful with double signs", [
          "Subtracting a negative is adding. Adding a negative is subtracting.",
          "4a − (−2b) + (−3a) − 3b = 4a + 2b − 3a − 3b = a − b."
        ]),
        T("t1", "Simplify", "write an expression in its shortest form by collecting like terms"),
        T("t2", "Collect like terms", "group terms with the same variable and exponent, then add or subtract their coefficients"),
        T("t3", "Distribute a minus", "when a − sign sits in front of a bracket, change the sign of every term inside"),
        Q("q1", "3x + 10 + 2x + 4 simplifies to:", ["5x + 14", "19x", "5x² + 14"], 0, "Combine the x terms (5x) and the constants (14). Exponents never change when adding."),
        Q("q2", "8y² − 5y − 10y² + 4y simplifies to:", ["−2y² − y", "−2y² + 9y", "18y² − y"], 0, "8 − 10 = −2 for the y² terms and −5 + 4 = −1 for the y terms."),
        Q("q3", "(5x + 9) + (2x − 12) =", ["7x − 3", "7x + 21", "3x − 3"], 0, "A plus in front leaves the bracket as is: 5x + 2x = 7x and 9 − 12 = −3."),
        Q("q4", "(11y + m) − (6y + 4m) =", ["5y − 3m", "5y + 5m", "17y − 3m"], 0, "The minus flips both terms: 11y − 6y = 5y and m − 4m = −3m."),
        Q("q5", "When you subtract a bracket, every term inside changes sign.", TF, 0, "True. m − (2x + 3y) = m − 2x − 3y."),
        Q("q6", "x² + x simplifies to 2x³.", TF, 1, "False. x² and x are not like terms, so x² + x is already as simple as it gets."),
        Q("q7", "4a − (−2b) + (−3a) − 3b =", ["a − b", "a − 5b", "7a − b"], 0, "Rewrite the signs: 4a + 2b − 3a − 3b. Then 4a − 3a = a and 2b − 3b = −b."),
        Q("q8", "When adding like terms the exponent stays the same.", TF, 0, "True. 3x² + 2x² = 5x², not 5x⁴."),
        Q("q9", "(0.4a − 0.3b) − (0.2a − 0.7b) =", ["0.2a + 0.4b", "0.2a − 1.0b", "0.6a − 1.0b"], 0, "Flip the second bracket: 0.4a − 0.3b − 0.2a + 0.7b = 0.2a + 0.4b.")
      ]),

      lesson("u3-l3", "Multiplying a polynomial by a monomial", [
        E("e1", "The distributive property", [
          "a(x + y) = ax + ay. The term in front multiplies every term inside the bracket, including its sign.",
          "2(4x + 2) = 8x + 4."
        ], "You already use it in mental math: 4 × 36 = 4(30 + 6) = 120 + 24 = 144."),
        E("e2", "When the term in front has a variable", [
          "Use the product rule for exponents: when you multiply powers of the same base, add the exponents. x · x = x², x · x² = x³.",
          "x(2x − 4) = 2x² − 4x. −x(4x − 3) = −4x² + 3x."
        ]),
        E("e3", "A negative in front flips every sign", [
          "−3x²(2x² − 4x + 3) = −6x⁴ + 12x³ − 9x².",
          "Multiply the coefficients, add the exponents, and watch each sign."
        ]),
        E("e4", "Two variables", [
          "Treat each variable separately and add its exponents.",
          "2xy²(2x³y² − 4xy + 6) = 4x⁴y⁴ − 8x²y³ + 12xy²."
        ]),
        E("e5", "Distribute, then collect", [
          "When there is more than one bracket, expand each one first and then collect like terms.",
          "2(6m − 3) − 2(20 − 5m) = 12m − 6 − 40 + 10m = 22m − 46."
        ], "7 − 3(2x² − 5x + 4) = 7 − 6x² + 15x − 12 = −6x² + 15x − 5."),
        E("e6", "Area of a rectangle", [
          "Area = length × width. If the sides are expressions, multiply them with the distributive property.",
          "Length 4x and width 2x + 3: area = 4x(2x + 3) = 8x² + 12x."
        ], "If x = 5 cm, the area is 8(25) + 12(5) = 200 + 60 = 260 cm²."),
        T("t1", "Distributive property", "a(x + y) = ax + ay: multiply every term inside the bracket by the term in front"),
        T("t2", "Monomial", "a single term, like 2x or −3x²"),
        T("t3", "Product rule", "when multiplying powers with the same base, add the exponents", "x³ · x² = x⁵"),
        T("t4", "Expand", "remove brackets by multiplying out", "the opposite of factoring"),
        Q("q1", "2(4x + 2) =", ["8x + 4", "8x + 2", "6x + 4"], 0, "Multiply both terms by 2: 2 · 4x = 8x and 2 · 2 = 4."),
        Q("q2", "x(2x − 4) =", ["2x² − 4x", "2x − 4x", "3x − 4"], 0, "x · 2x = 2x² (add the exponents) and x · (−4) = −4x."),
        Q("q3", "−x(4x − 3) =", ["−4x² + 3x", "−4x² − 3x", "4x² − 3x"], 0, "The negative flips both signs: −4x² and +3x."),
        Q("q4", "A rectangle has length 4x and width 2x + 3. Its area is:", ["8x² + 12x", "6x + 3", "8x + 12"], 0, "Area = 4x(2x + 3) = 8x² + 12x."),
        Q("q5", "−3x²(2x² − 4x + 3) =", ["−6x⁴ + 12x³ − 9x²", "−6x⁴ − 12x³ + 9x²", "−6x² + 12x − 9"], 0, "Multiply coefficients, add exponents, flip each sign: −6x⁴ + 12x³ − 9x²."),
        Q("q6", "x · x² = x³ because you add the exponents.", TF, 0, "True. x¹ · x² = x¹⁺² = x³."),
        Q("q7", "7 − 3(2x² − 5x + 4) =", ["−6x² + 15x − 5", "−6x² − 15x + 19", "4(2x² − 5x + 4)"], 0, "Only the 3 is distributed, with its minus: 7 − 6x² + 15x − 12 = −6x² + 15x − 5. Don't subtract 7 − 3 first."),
        Q("q8", "The sign of the term in front of the bracket is part of what you multiply by.", TF, 0, "True. −2(x + 3) = −2x − 6, not −2x + 6."),
        Q("q9", "2xy²(2x³y² − 4xy + 6) =", ["4x⁴y⁴ − 8x²y³ + 12xy²", "4x³y⁴ − 8xy³ + 12xy²", "4x⁴y⁴ − 8x²y³ + 6"], 0, "Add exponents for each variable: 2xy² · 2x³y² = 4x⁴y⁴, 2xy² · (−4xy) = −8x²y³, 2xy² · 6 = 12xy².")
      ]),

      lesson("u3-l4", "Expand and simplify: area and perimeter", [
        E("e1", "Putting it all together", [
          "Expand every bracket with the distributive property, then collect like terms.",
          "3m(m − 5) − (2m² − m) = 3m² − 15m − 2m² + m = m² − 14m."
        ], "The minus in front of the second bracket flips both of its terms."),
        E("e2", "Simplify first, then evaluate", [
          "If you are asked for a value, simplify the whole expression before substituting the numbers. Fewer calculations means fewer mistakes.",
          "2(2x − y) + 3(6x + y) − 4(2x − y) = 4x − 2y + 18x + 3y − 8x + 4y = 14x + 5y."
        ], "At x = −1 and y = 2: 14(−1) + 5(2) = −14 + 10 = −4."),
        E("e3", "Perimeter", [
          "Perimeter is the distance around a shape, so add every side. The answer is in units (like cm).",
          "A rectangle 2x by 3x + 2: P = 2x + 2x + (3x + 2) + (3x + 2) = 10x + 4."
        ]),
        E("e4", "Area", [
          "Area is the space inside, so multiply length by width. The answer is in square units (like cm²).",
          "The same rectangle, 2x by 3x + 2: A = 2x(3x + 2) = 6x² + 4x."
        ], "Perimeter adds, area multiplies. The units tell you which one you have."),
        E("e5", "Finding a missing side", [
          "If you know the perimeter and all the sides but one, subtract the known sides from the perimeter.",
          "Triangle with perimeter 7x² + 4x − 7 and sides 3x² − 5x + 2 and 2x² + 3x + 1: the two known sides add to 5x² − 2x + 3, so the third side is 7x² + 4x − 7 − (5x² − 2x + 3) = 2x² + 6x − 10."
        ]),
        E("e6", "Shaded regions", [
          "A shaded region is the big shape minus the hole. Subtract the small area from the large one, and remember the minus flips the small area's signs.",
          "Large area 5x² + 7x + 4, hole x² + 2x + 1: shaded = 4x² + 5x + 3."
        ]),
        E("e7", "Composite figures", [
          "For an L-shape or a figure made of rectangles, split it into rectangles, find each area, then add.",
          "For the perimeter of a composite figure, walk around the outside and add every edge you pass. Inside edges don't count."
        ]),
        T("t1", "Perimeter", "the distance around a shape: add all the sides", "measured in units"),
        T("t2", "Area", "the space inside a shape: for a rectangle, length × width", "measured in square units"),
        T("t3", "Composite figure", "a shape made from two or more simple shapes joined together"),
        T("t4", "Evaluate", "find the value of an expression by substituting numbers for the variables", "simplify first"),
        Q("q1", "3m(m − 5) − (2m² − m) =", ["m² − 14m", "m² − 16m", "5m² − 14m"], 0, "3m² − 15m − 2m² + m. The m² terms give m², the m terms give −14m."),
        Q("q2", "A rectangle has sides 2x and 3x + 2. Its perimeter is:", ["10x + 4", "5x + 2", "6x² + 4x"], 0, "Add all four sides: 2(2x) + 2(3x + 2) = 4x + 6x + 4 = 10x + 4."),
        Q("q3", "The same rectangle, 2x by 3x + 2, has area:", ["6x² + 4x", "10x + 4", "6x + 4"], 0, "Multiply: 2x(3x + 2) = 6x² + 4x."),
        Q("q4", "Simplify 2(2x − y) + 3(6x + y) − 4(2x − y):", ["14x + 5y", "14x − 3y", "30x + 5y"], 0, "x terms: 4 + 18 − 8 = 14. y terms: −2 + 3 + 4 = 5."),
        Q("q5", "Perimeter is measured in square units.", TF, 1, "False. Perimeter is a length, measured in units. Area uses square units."),
        Q("q6", "A triangle has perimeter 7x² + 4x − 7 and two sides 3x² − 5x + 2 and 2x² + 3x + 1. The third side is:", ["2x² + 6x − 10", "2x² − 2x − 4", "12x² + 2x − 4"], 0, "Add the known sides (5x² − 2x + 3) and subtract from the perimeter, flipping signs: 2x² + 6x − 10."),
        Q("q7", "To simplify and evaluate, substitute the numbers first and then simplify.", TF, 1, "False. Simplify first so you have fewer calculations to do with the numbers."),
        Q("q8", "The area of a large rectangle is 5x² + 7x + 4. A hole of area x² + 2x + 1 is cut out. The shaded area is:", ["4x² + 5x + 3", "6x² + 9x + 5", "4x² + 5x + 5"], 0, "Subtract and flip the signs of the hole: 5x² − x² = 4x², 7x − 2x = 5x, 4 − 1 = 3."),
        Q("q9", "If x = 4 cm, a perimeter of 12x + 12 equals:", ["60 cm", "48 cm", "60 cm²"], 0, "12(4) + 12 = 60. Perimeter is in cm, not cm².")
      ]),

      lesson("u3-l5", "Factoring: common factors", [
        E("e1", "Factoring is expanding in reverse", [
          "Expanding removes brackets: 3(x + 2) = 3x + 6. Factoring puts them back: 3x + 6 = 3(x + 2).",
          "A factored polynomial is written as a product of factors."
        ], "You can always check a factoring by expanding it again."),
        E("e2", "Greatest common factor", [
          "The GCF is the largest factor that divides every term.",
          "For the numbers, find the biggest number that divides all the coefficients. For each variable, take the lowest power that appears in every term."
        ], "GCF of 12p³ and 14p²: numbers give 2, p gives p². GCF = 2p²."),
        E("e3", "GCF examples", [
          "15 and 20: 5. 4a and 6a: 2a. 5x and 8: 1 (nothing but 1 divides both).",
          "4x² and 12: 4. 6x²y² and 9xy: 3xy. 3x², 4x and 5x³: x."
        ]),
        E("e4", "Steps to factor", [
          "1. Find the GCF of all the terms. 2. Write the GCF in front of a bracket. 3. Divide each term by the GCF and write the answers inside the bracket.",
          "6x + 27: GCF is 3. 6x ÷ 3 = 2x and 27 ÷ 3 = 9, so 6x + 27 = 3(2x + 9)."
        ]),
        E("e5", "Factoring with variables", [
          "2x³ + 4x²: GCF is 2x². 2x³ ÷ 2x² = x and 4x² ÷ 2x² = 2, so the answer is 2x²(x + 2).",
          "4x² + 22x: GCF is 2x, giving 2x(2x + 11)."
        ], "When dividing powers, subtract the exponents: x³ ÷ x² = x."),
        E("e6", "Factor fully", [
          "Fully means the whole GCF comes out, not just part of it.",
          "8x²y − 32xy²: the GCF is 8xy, so the answer is 8xy(x − 4y). Writing 4xy(2x − 8y) is not finished, because 2 still divides both terms inside."
        ]),
        E("e7", "Three or more terms", [
          "The same steps work with any number of terms.",
          "3x² + 12x³ − 6x: the GCF of 3x², 12x³ and 6x is 3x, so it factors to 3x(x + 4x² − 2). Written in descending order inside: 3x(4x² + x − 2)."
        ]),
        T("t1", "Factor (verb)", "write a polynomial as a product of factors", "the inverse of expanding"),
        T("t2", "Factor (noun)", "a number or expression that divides another evenly", "3 and x + 2 are factors of 3x + 6"),
        T("t3", "Greatest common factor (GCF)", "the largest factor that divides every term"),
        T("t4", "Prime factors", "the prime numbers that multiply to give a number", "20 = 2 × 2 × 5"),
        T("t5", "Factor fully", "take out the entire GCF so nothing more can be factored out of the bracket"),
        Q("q1", "The GCF of 15 and 20 is:", ["5", "10", "60"], 0, "5 is the largest number that divides both. 60 is a common multiple, not a factor."),
        Q("q2", "The GCF of 4a and 6a is:", ["2a", "2", "12a"], 0, "2 divides 4 and 6, and a appears in both terms."),
        Q("q3", "The GCF of 12p³ and 14p² is:", ["2p²", "2p³", "24p²"], 0, "Numbers: 2. Variable: the lower power, p². GCF = 2p²."),
        Q("q4", "Factor fully: 6x + 27", ["3(2x + 9)", "6(x + 27)", "3(2x + 27)"], 0, "GCF is 3. Divide each term: 2x and 9. Check: 3(2x + 9) = 6x + 27."),
        Q("q5", "Factor fully: 2x³ + 4x²", ["2x²(x + 2)", "2x(x² + 2)", "x²(2x + 4)"], 0, "The GCF is 2x². The other two options leave a common factor inside the bracket."),
        Q("q6", "The GCF of 5x and 8 is:", ["1", "5", "40"], 0, "5 and 8 share no factor except 1, and 8 has no x."),
        Q("q7", "Factoring is the inverse of expanding.", TF, 0, "True. 3(x + 2) = 3x + 6 expands; 3x + 6 = 3(x + 2) factors."),
        Q("q8", "The GCF of 6x²y² and 9xy is:", ["3xy", "3x²y²", "18xy"], 0, "Numbers: 3. Lowest powers: x and y. GCF = 3xy."),
        Q("q9", "Factor fully: 8x²y − 32xy²", ["8xy(x − 4y)", "8xy(x − 4y²)", "4xy(2x − 8y)"], 0, "GCF is 8xy. 8x²y ÷ 8xy = x and 32xy² ÷ 8xy = 4y."),
        Q("q10", "x² + 2x = x(x + 2)", TF, 0, "True. The GCF is x; check by expanding: x · x + x · 2 = x² + 2x."),
        Q("q11", "4n² − 12n factored fully is 4(n² − 3n).", TF, 1, "False. n is also a common factor. Fully factored it is 4n(n − 3).")
      ])
    ]
  };

  window.COURSE_DATA = {
    code: COURSE,
    title: "Principles of Mathematics",
    subtitle: "Grade 9 Math",
    units: [u3]
  };
})();
