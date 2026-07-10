import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { getCourse } from "@/lib/courses";
import { CourseOverviewPage } from "@/components/course/CourseOverviewPage";

export const Route = createFileRoute("/learn/$course/")({
  beforeLoad: ({ params }) => {
    const course = getCourse(params.course);
    if (!course) throw notFound();
    if (course.redirectRoute) {
      throw redirect({ to: course.redirectRoute });
    }
  },
  loader: ({ params }) => params,
  head: ({ params }) => {
    const c = getCourse(params.course);
    const title = c ? `${c.title} — DSA with Python` : "Course — DSA with Python";
    const desc = c?.tagline ?? "Learn data structures & algorithms in Python.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
      ],
    };
  },
  component: CoursePage,
});

function CoursePage() {
  const { course: slug } = Route.useLoaderData();
  return <CourseOverviewPage slug={slug} />;
}
