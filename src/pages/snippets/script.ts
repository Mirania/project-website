const snippetCardBuilder = new CardBuilder();

snippetCardBuilder.addLeftCard(
    ["snippets/assets/firebase.png", "snippets/assets/firebase-java.png"],
    "Simple Firebase API",
    `${langs("Java, JavaScript and TypeScript")} ` +
    `A collection of functions (${inlineGoldHref("JavaScript", "https://github.com/Mirania/snippets/tree/master/TS%20-%20Firebase%20API")} / ` +
    `${inlineGoldHref("Java", "https://github.com/Mirania/snippets/tree/master/Java%20-%20Firebase%20API")}) ` +
    `that make working with ${inlineHref("Firebase", "https://firebase.google.com/")} ` +
    `databases extremely easy. ${paragraph()} The functions hide all the callbacks and method ` +
    `chains required to perform the most important operations (CRUD, connect), turning operations such as retrieving ` +
    `a user's data into something as simple as ${code("db.get(\"users/1\")")} .`,
    false,
    true
);

snippetCardBuilder.addRightCard(
    "snippets/assets/rest.png",
    "Rest API Consumer",
    `${langs("Java")} ` +
    `A ${inlineGoldHref("class", "https://github.com/Mirania/snippets/tree/master/Java%20-%20REST%20API%20consumer")} ` +
    `that hides all networking boilerplate and provides a way to communicate with REST APIs in a ` +
    `very simple manner. ${paragraph()} It is flexible and extensible, turning common REST procedures such ` +
    `as POST requests into something trivial like ${code("reply = post(url, data)")} .`,
    false,
    true
);

snippetCardBuilder.addLeftCard(
    "snippets/assets/autocorrect.png",
    "Autocorrect",
    `${langs("JavaScript and TypeScript")} ` +
    `A high performance ${inlineHref("word suggester", "https://github.com/Mirania/snippets/tree/master/TS%20-%20Autocorrect")} ` +
    `that takes a dictionary and finds the words that are the most similar to any given user input, using ` +
    `${inlineHref("Levenshtein distance", "https://en.wikipedia.org/wiki/Levenshtein_distance")}. ` +
    `${paragraph()} Able to deliver multiple suggestions from dictionaries with a million words, it's simple, ` +
    `customizable and not bound to any language.`,
    false,
    true
);

snippetCardBuilder.addRightCard(
    "snippets/assets/pyarray.png",
    "Pythonic JavaScript Arrays",
    `${langs("JavaScript and TypeScript")} ` +
    `An ${inlineGoldHref("extension","https://github.com/Mirania/snippets/tree/master/TS%20-%20Pythonic%20Arrays")} ` +
    `of JavaScript's ${code("Array")} class that provides functionality similar to that of Python arrays. ` +
    `${paragraph()} By extending ${code("Array")} and using a ` +
    `${inlineHref("proxy", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy")}, ` +
    `it's possible to augment the behaviour of arrays and still have TypeScript's type system play nice ` +
    `with them, allowing for popular features like negative indexes (${code("list[-1]")}) and array slicing ` +
    `(${code("list[\"1:3\"]")}).`,
    false,
    true
);

snippetCardBuilder.addLeftCard(
    "snippets/assets/colors.png",
    "Console Coloring",
    `${langs("JavaScript and TypeScript")} ` +
    `A ${inlineGoldHref("library", "https://github.com/Mirania/console-colors")} that manages output color ` +
    `when writing to the JavaScript console, available as a ${inlineHref("npm", "https://www.npmjs.com/")} ` +
    `module. ${paragraph()} It extends the native ${code("Console")} with intuitive ` +
    `functions like ${code("console.red(\"text\")")} to print using varied colors, with an OOP approach ` +
    `that additionally lets users create and store colored strings.`,
    false,
    true
);

snippetCardBuilder.addRightCard(
    "snippets/assets/unchecker.png",
    "Exception Unchecker",
    `${langs("Java")} ` +
    `Short and sweet way of converting checked exceptions into unchecked ones without losing any stack trace `  +
    `or name information. ${paragraph()} It is a ` +
    `${inlineGoldHref("class", "https://github.com/Mirania/snippets/tree/master/Java%20-%20Exception%20Unchecker")} ` +
    `that exposes a single method, ${code("perform()")}, which accepts a lambda and turns any checked exception ` +
    `that would be thrown into an unchecked version of it, removing the need for try-catch operations.`,
    false,
    true
);

snippetCardBuilder.animateEntries();