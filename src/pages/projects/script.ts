const body = document.body;
const galleries: Gallery[] = [];
const entries: Entry[] = [];

addLeftCard(
    ["projects/assets/1.mp4", "projects/assets/2.mp4", "projects/assets/3.mp4"],
    "Pokémon Unity",
    `A fully-fledged Pokémon game with a scale and complexity comparable to old school ` +
    `mainstream Pokémon games, built from the ground up using the ${inlineHref("Unity Engine", "https://unity.com/")}. ` + 
    `It includes an entirely new story and a different take on some mechanics.${inlineBr()}${inlineBr()} ` +
    `A playable demo will be available very soon.${inlineBr()}${inlineBr()} ` + 
    `${inlineSmall("You can unmute and fullscreen any of the videos if you wish to.")}`,
    true,
    true
);

addRightCard(
    "projects/assets/marble.mp4",
    "Marble",
    `A physics-based platforming game that will be developed using the ${inlineHref("Unity Engine", "https://unity.com/")}. ` +
    `A small prototype made with the ${inlineHref("three.js", "https://threejs.org/")} library ` +
    `can be played ${inlineGoldHref("here", "demo")}.${inlineBr()}${inlineBr()}` +
    `${inlineSmall("You can fullscreen the video if you wish to.")}`,
    true,
    true
);

addLeftCard(
    "projects/assets/jscrambler.png",
    "Improvement of a JavaScript Obfuscator",
    `Internship at ${inlineHref("Jscrambler", "https://jscrambler.com/")}, a company that develops security ` +
    `solutions for JavaScript codebases. I was tasked with improving the performance of the company's core ` +
    `commercial product, a JavaScript ${inlineHref("code obfuscator", "https://en.wikipedia.org/wiki/Obfuscation_(software)")}, ` +
    `as a long-term solo project.${inlineBr()}${inlineBr()} ` +
    `The activity, performed alongside a Master's degree dissertation, was a success, having developed multiple ` +
    `${inlineHref("AST", "https://en.wikipedia.org/wiki/Abstract_syntax_tree")} traversal algorithms that ` +
    `provided performance gains of up to 30% without sacrificing usability nor maintainability.`,
    false,
    false
);

addRightCard(
    "projects/assets/collab.mp4",
    "Multi-user Image Editor",
    `A project conducted during the final semester of the Bachelor's degree.${inlineBr()}${inlineBr()} ` +
    `As a team of 5, we used an API that served huge medical images ${inlineGrey("(60000x60000 or larger)")} to ` +
    `create a platform that allowed for the real-time multi-user editing of those images, complete with ` +
    `${inlineHref("collaboration tools", "https://togetherjs.com/")}, rooms, invitations, a permission system, ` +
    `a ${inlineHref("persistence unit", "https://www.mongodb.com/")} and the ability to record and replay ` +
    `sessions.${inlineBr()}${inlineBr()}${inlineSmall("You can unmute and fullscreen the video if you wish to.")}`,
    true,
    true
);

animateEntries();