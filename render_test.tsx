import React from "react";
import ReactDOMServer from "react-dom/server";
import { LessonView } from "./src/components/course/LessonView";
import { introductionToDsaCourse } from "./src/lib/courses/introduction-to-dsa";

const lesson = introductionToDsaCourse.lessons[0];
const html = ReactDOMServer.renderToStaticMarkup(
  React.createElement(LessonView, {
    course: introductionToDsaCourse,
    lesson: lesson,
    index: 0,
  })
);

console.log("HTML Output:");
console.log(html);

