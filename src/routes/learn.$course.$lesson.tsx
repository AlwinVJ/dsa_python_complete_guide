import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { getCourse, getLesson, getPrevNext } from "@/lib/courses";
import { LessonView } from "@/components/course/LessonView";

export const Route = createFileRoute("/learn/$course/$lesson")({
  beforeLoad: ({ params }) => {
    const course = getCourse(params.course);
    if (!course) throw notFound();
    if (course.redirectRoute) {
      throw redirect({ to: course.redirectRoute });
    }
    if (!getLesson(params.course, params.lesson)) throw notFound();
  },
  loader: ({ params }) => params,
  head: ({ params }) => {
    const found = getLesson(params.course, params.lesson);
    const course = getCourse(params.course);
    const title = found
      ? `${found.lesson.title} — ${course?.title} — DSA with Python`
      : "Lesson — DSA with Python";
    const desc =
      found?.lesson.tagline ?? found?.lesson.theory?.slice(0, 150) ?? course?.tagline ?? "";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
      ],
    };
  },
  component: LessonPage,
});

function LessonPage() {
  const { course: courseSlug, lesson: lessonSlug } = Route.useLoaderData();
  const found = getLesson(courseSlug, lessonSlug)!;
  const { prev, next } = getPrevNext(found.course, found.index);
  return (
    <LessonView
      course={found.course}
      lesson={found.lesson}
      index={found.index}
      prev={prev}
      next={next}
    />
  );
}
